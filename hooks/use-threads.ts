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
  set: async (data: ParsedMessage & { q: string }) => {
    await idb.threads.put(data);
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
  const [_, folder, query, max, labelIds] = args;

  let searchParams = new URLSearchParams();
  if (max) searchParams.set("max", max.toString());
  if (query) searchParams.set("q", query);
  if (folder) searchParams.set("folder", folder.toString());
  if (labelIds) searchParams.set("labelIds", labelIds.join(","));

  return (await $fetch("/api/v1/mail?" + searchParams.toString(), {
    baseURL: BASE_URL,
    onSuccess(context) {
      Promise.all(
        context.data.threads.map((message: ParsedMessage) => {
          return threadsCache.set({ ...message, q: searchParams.toString() });
        }),
      );
    },
  }).then((e) => e.data)) as RawResponse;
};

const fetchEmailsFromCache = async (args: any[]) => {
  const [, , folder, query, max, labelIds] = args;
  let searchParams = new URLSearchParams();
  if (max) searchParams.set("max", max.toString());
  if (query) searchParams.set("q", query);
  if (folder) searchParams.set("folder", folder.toString());
  if (labelIds) searchParams.set("labelIds", labelIds.join(","));
  const data = await threadsCache.list(searchParams.toString());
  return { threads: data };
};

const fetchEmail = async (args: any[]): Promise<ParsedMessage> => {
  const [_, id] = args;
  const existing = await threadsCache.get(id);
  if (existing?.blobUrl) return existing as ParsedMessage;
  return await $fetch(`/api/v1/${id}/`, {
    baseURL: BASE_URL,
    onSuccess(context) {
      threadsCache.set(context.data);
    },
  }).then((e) => (e.data as ParsedMessage[])[0]);
};

// Based on gmail
interface RawResponse {
  nextPageToken: number;
  threads: InitialThread[];
  resultSizeEstimate: number;
}

interface ThreadsResponse {
  threads: ParsedMessage[];
}

const useCachedThreads = (folder: string, labelIds?: string[], query?: string, max?: number) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ThreadsResponse>(
    ["cache", session?.user.id, folder, query, max, labelIds],
    fetchEmailsFromCache,
  );

  return { data, isLoading, error };
};

export const useThreads = (folder: string, labelIds?: string[], query?: string, max?: number) => {
  const { data: cachedThreads } = useCachedThreads(folder, labelIds, query, max);
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<RawResponse>(
    session?.user.id ? [session?.user.id, folder, query, max, labelIds] : null,
    fetchEmails,
  );

  return {
    data: data ?? cachedThreads,
    isLoading: cachedThreads?.threads.length ? false : isLoading,
    error,
  };
};

export const useThread = (id: string) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ParsedMessage>(
    session?.user.id ? [session.user.id, id] : null,
    fetchEmail,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return { data, isLoading, error };
};
