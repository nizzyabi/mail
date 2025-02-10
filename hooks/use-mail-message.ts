import { $fetch, useSession } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { ParsedMessage } from "@/types";
import useSWR from "swr";

const fetchMessage = async (args: any[]): Promise<ParsedMessage | null> => {
  const [_, messageId] = args;
  if (!messageId) return null;

  return await $fetch(`/api/v1/mail/${messageId}`, {
    baseURL: BASE_URL,
  }).then((e) => e.data as ParsedMessage);
};

export function useMailMessage(messageId: string | null) {
  const { data: session } = useSession();
  const { data, isLoading, error } = useSWR<ParsedMessage>(
    messageId ? [session?.user.id, messageId] : null,
    fetchMessage,
  );

  return { data, isLoading, error };
}
