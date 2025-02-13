"use client";
import { $fetch, useSession } from "@/lib/auth-client";
import { InitialThread, ParsedMessage } from "@/types";
import { BASE_URL } from "@/lib/constants";
import useSWR, { preload } from "swr";
import { idb } from "@/lib/idb";

export const preloadThread = (userId: string, threadId: string) => {
  console.log(`🔄 Prefetching email ${threadId}...`);
  preload([userId, threadId], fetchEmail);
};

const threadsCache = {
  add: async (data: ParsedMessage & { q: string }) => {
    try {
      await idb.threads.add(data, data.id);
    } catch (err) {
      console.error("Failed to cache email:", err);
    }
  },
  bulkAdd: async (data: ParsedMessage[]) => {
    try {
      await idb.threads.bulkAdd(data);
    } catch (err) {
      console.error("Failed to cache emails:", err);
    }
  },
  update: async (data: Partial<ParsedMessage> & { id: string }) => {
    try {
      await idb.threads.update(data.id, { ...data });
    } catch (err) {
      console.error("Failed to cache email:", err);
    }
  },
  markAsRead: async (id: string) => {
    try {
      const thread = await idb.threads.get(id);
      if (thread) {
        await idb.threads.update(id, {
          ...thread,
          unread: false,
        });
      }
    } catch (err) {
      console.error("Failed to mark email as read in cache:", err);
    }
  },
  put: async (data: ParsedMessage) => {
    try {
      await idb.threads.put(data);
    } catch (err) {
      console.error("Failed to cache email:", err);
    }
  },
  bulkPut: async (data: ParsedMessage[], q: string) => {
    try {
      const keysToUpdate = await Promise.all(
        data.map((item) => idb.threads.get(item.id).then((e) => e?.id)),
      );
      await idb.threads.bulkUpdate(
        data
          .filter((e) => !!e.blobUrl)
          .map((item) => ({
            key: item.id,
            changes: {
              blobUrl: item.blobUrl,
              processedHtml: item.processedHtml,
              body: item.body,
            },
          })),
      );
      const keysToAdd = data
        .filter((item) => !keysToUpdate.includes(item.id))
        .map((e) => ({ ...e, q }));
      await idb.threads.bulkPut(keysToAdd);
    } catch (err) {
      console.error("Failed to cache emails:", err);
    }
  },
  get: async (id: string) => {
    const data = await idb.threads.get(id);
    return data ?? null;
  },
  list: async (q: string) => {
    const data = await idb.threads.where("q").equalsIgnoreCase(q).toArray();
    return data ?? [];
  },
};

// TODO: improve the filters
const fetchEmails = async (args: any[]) => {
  const [_, folder, query, max, labelIds, connectionId] = args;

  const searchParams = new URLSearchParams();
  if (max) searchParams.set("max", max.toString());
  if (query) searchParams.set("q", query);
  if (folder) searchParams.set("folder", folder.toString());
  if (labelIds) searchParams.set("labelIds", labelIds.join(","));

  return (await $fetch("/api/v1/mail?" + searchParams.toString(), {
    baseURL: BASE_URL,
    onSuccess(context) {
      // reversing the order of the messages to make sure the newest ones are at the top
      threadsCache.bulkPut(context.data.messages, searchParams.toString() + connectionId);
    },
  }).then((e) => e.data)) as RawResponse;
};

const fetchEmailsFromCache = async (args: any[]) => {
  const [, , folder, query, max, labelIds, connectionId] = args;
  const searchParams = new URLSearchParams();
  if (max) searchParams.set("max", max.toString());
  if (query) searchParams.set("q", query);
  if (folder) searchParams.set("folder", folder.toString());
  if (labelIds) searchParams.set("labelIds", labelIds.join(","));
  const data = await threadsCache.list(searchParams.toString() + connectionId);
  return { messages: data.reverse() };
};

const fetchEmail = async (args: any[]): Promise<ParsedMessage> => {
  const [_, id] = args;
  const existing = await threadsCache.get(id);
  if (existing?.blobUrl) return existing as ParsedMessage;
  return await $fetch(`/api/v1/mail/${id}/`, {
    baseURL: BASE_URL,
    onSuccess(context) {
      threadsCache.update({
        id,
        blobUrl: context.data.blobUrl,
        processedHtml: context.data.processedHtml,
        body: context.data.body,
      });
    },
  }).then((e) => e.data as ParsedMessage);
};

// Based on gmail
interface RawResponse {
  nextPageToken: number;
  messages: InitialThread[];
  resultSizeEstimate: number;
}

interface ThreadsResponse {
  messages: ParsedMessage[];
}

const useCachedThreads = (folder: string, labelIds?: string[], query?: string, max?: number) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ThreadsResponse>(
    ["cache", session?.user.id, folder, query, max, labelIds, session?.connectionId],
    fetchEmailsFromCache,
  );

  return { data, isLoading, error };
};

export const useThreads = (folder: string, labelIds?: string[], query?: string, max?: number) => {
  const { data: cachedThreads } = useCachedThreads(folder, labelIds, query, max);
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<RawResponse>(
    session?.user.id
      ? [session?.user.id, folder, query, max, labelIds, session.connectionId]
      : null,
    fetchEmails,
  );

  return {
    data: data ?? cachedThreads,
    isLoading: cachedThreads?.messages.length ? false : isLoading,
    error,
  };
};

export const useThread = (id: string) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ParsedMessage>(
    session?.user.id ? [session.user.id, id, session.connectionId] : null,
    fetchEmail,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return { data, isLoading, error };
};

export const useMarkAsRead = () => {
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mail/${id}/read`, {
        method: "POST",
      });

      if (response.ok) {
        await threadsCache.markAsRead(id);
      }

      return response.ok;
    } catch (error) {
      console.error("Error marking email as read:", error);
      return false;
    }
  };

  return { markAsRead };
};
