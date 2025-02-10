"use client";
import { $fetch, useSession } from "@/lib/auth-client";
import { InitialThread, ParsedMessage } from "@/types";
import { BASE_URL } from "@/lib/constants";
import useSWR from "swr";

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
  }).then((e) => e.data)) as RawResponse;
};

const fetchEmail = async (args: any[]): Promise<ParsedMessage> => {
  const [_, id] = args;
  return await $fetch(`/api/v1/mail/${id}`, {
    baseURL: BASE_URL,
  }).then((e) => e.data as ParsedMessage);
};

// Based on gmail
interface RawResponse {
  nextPageToken: number;
  messages: InitialThread[];
  resultSizeEstimate: number;
}

export const useThreads = (folder: string, labelIds?: string[], query?: string, max?: number) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<RawResponse>(
    [session?.user.id, folder, query, max, labelIds],
    fetchEmails,
  );

  return { data, isLoading, error };
};

export const useThread = (id: string) => {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ParsedMessage>([session?.user.id, id], fetchEmail);

  return { data, isLoading, error };
};
