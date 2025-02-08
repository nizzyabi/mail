import { ParsedMessage } from "@/types";
import { google } from "googleapis";
import * as he from "he";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface MailManager {
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  delete(id: string): Promise<any>;
  list(folder: string, query?: string, maxResults?: number): Promise<any>;
}

interface IConfig {
  auth: string;
}

const googleDriver = (config: IConfig): MailManager => {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  });
  auth.setCredentials({ access_token: config.auth, scope: "https://mail.google.com/" });
  const parse = ({
    id,
    snippet,
    labelIds,
    payload,
  }: {
    id: string;
    snippet: string;
    labelIds: string[];
    payload: {
      headers: { name: string; value: string }[];
    };
    body: string;
  }): ParsedMessage => {
    const receivedOn = payload.headers.find((h) => h.name === "Date")?.value || "Failed";
    const sender = payload.headers.find((h) => h.name === "From")?.value || "Failed";
    const [name, email] = sender.split("<");
    return {
      id,
      title: he.decode(snippet),
      tags: labelIds,
      sender: {
        name: name.replace(/"/g, ""),
        email: `<${email}`,
      },
      unread: labelIds.includes("UNREAD"),
      receivedOn,
    };
  };
  const gmail = google.gmail({ version: "v1", auth });
  return {
    list: async (folder, q, maxResults = 10) => {
      const res = await gmail.users.messages.list({
        userId: "me",
        q,
        labelIds: [folder.toUpperCase()],
        maxResults,
      });
      return res.data;
    },
    get: async (id: string) => {
      const res = await gmail.users.messages.get({ userId: "me", id });
      return parse(res.data as any);
    },
    create: async (data: any) => {
      const res = await gmail.users.messages.send({ userId: "me", requestBody: data });
      return res.data;
    },
    delete: async (id: string) => {
      const res = await gmail.users.messages.delete({ userId: "me", id });
      return res.data;
    },
  };
};

const SupportedProviders = {
  google: googleDriver,
};

export const createDriver = (
  provider: keyof typeof SupportedProviders,
  config: IConfig,
): MailManager => {
  const factory = SupportedProviders[provider];
  if (!factory) throw new Error("Provider not supported");
  switch (provider) {
    case "google":
      return factory(config);
    default:
      throw new Error("Provider not supported");
  }
};
