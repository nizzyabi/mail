import {
  ALLOWED_HTML_TAGS,
  ALLOWED_HTML_ATTRIBUTES,
  ALLOWED_HTML_STYLES,
  EMAIL_HTML_TEMPLATE,
} from "@/lib/constants";
import sanitizeHtml from "sanitize-html";
import { ParsedMessage } from "@/types";
import { google } from "googleapis";
import * as he from "he";

interface MailManager {
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  delete(id: string): Promise<any>;
  list(folder: string, query?: string, maxResults?: number, labelIds?: string[]): Promise<any>;
  count(): Promise<any>;
}

interface IConfig {
  auth: {
    access_token: string;
    refresh_token: string;
  };
}

function fromBinary(str: string) {
  return decodeURIComponent(
    atob(str.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
}

const findHtmlBody = (parts: any[]): string => {
  for (const part of parts) {
    if (part.mimeType === "text/html" && part.body?.data) {
      console.log("✓ Driver: Found HTML content in message part");
      return part.body.data;
    }
    if (part.parts) {
      const found = findHtmlBody(part.parts);
      if (found) return found;
    }
  }
  console.log("⚠️ Driver: No HTML content found in message parts");
  return "";
};

function createEmailHtml(decodedBody: string): string {
  const sanitizedHtml = sanitizeHtml(decodedBody, {
    allowedTags: ALLOWED_HTML_TAGS,
    allowedAttributes: ALLOWED_HTML_ATTRIBUTES,
    allowedStyles: ALLOWED_HTML_STYLES,
  });

  return EMAIL_HTML_TEMPLATE.replace("{{content}}", sanitizedHtml);
}

const googleDriver = (config: IConfig): MailManager => {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  });
  auth.setCredentials({ ...config.auth, scope: "https://mail.google.com/" });
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
      body?: { data?: string };
      parts?: any[];
    };
    body: string;
  }): Omit<ParsedMessage, "body" | "processedHtml" | "blobUrl" | "totalReplies"> => {
    const receivedOn = payload.headers.find((h) => h.name === "Date")?.value || "Failed";
    const sender = payload.headers.find((h) => h.name === "From")?.value || "Failed";
    const subject = payload.headers.find((h) => h.name === "Subject")?.value || "Failed";
    const [name, email] = sender.split("<");
    return {
      id,
      title: he.decode(snippet),
      tags: labelIds,
      sender: {
        name: name.replace(/"/g, "").trim(),
        email: `<${email}`,
      },
      subject: subject,
      unread: labelIds.includes("UNREAD"),
      receivedOn,
    };
  };
  const normalizeSearch = (folder: string, q: string) => {
    if (folder === "trash") {
      return { folder: undefined, q: `in:trash ${q}` };
    }
    return { folder, q };
  };
  const gmail = google.gmail({ version: "v1", auth });
  return {
    count: async () => {
      const folders = ["inbox", "spam"];
      return await Promise.all(
        folders.map(async (folder) => {
          const { folder: normalizedFolder, q: normalizedQ } = normalizeSearch(folder, "");
          const labelIds = [];
          if (normalizedFolder) labelIds.push(normalizedFolder.toUpperCase());
          const res = await gmail.users.messages.list({
            userId: "me",
            q: normalizedQ ? normalizedQ : undefined,
            labelIds,
          });
          return res.data.resultSizeEstimate;
        }),
      );
    },
    list: async (folder, q, maxResults = 10, _labelIds: string[] = []) => {
      const { folder: normalizedFolder, q: normalizedQ } = normalizeSearch(folder, q ?? "");
      const labelIds = [..._labelIds];
      if (normalizedFolder) labelIds.push(normalizedFolder.toUpperCase());
      const res = await gmail.users.threads.list({
        userId: "me",
        q: normalizedQ ? normalizedQ : undefined,
        labelIds,
        maxResults,
      });
      const threads = await Promise.all(
        (res.data.threads || [])
          .map(async (thread) => {
            if (!thread.id) return null;
            const msg = await gmail.users.threads.get({
              userId: "me",
              id: thread.id,
              format: "metadata",
              metadataHeaders: ["From", "Subject", "Date"],
            });
            const message = msg.data.messages?.[0];
            const parsed = parse(message as any);
            return {
              ...parsed,
              body: "",
              processedHtml: "",
              blobUrl: "",
              totalReplies: msg.data.messages?.length || 0,
            };
          })
          .filter((msg): msg is NonNullable<typeof msg> => msg !== null),
      );

      return { ...res.data, threads };
    },

    get: async (id: string) => {
      const res = await gmail.users.threads.get({ userId: "me", id, format: "full" });
      const messages = res.data.messages?.map((message) => {
        const bodyData =
          (message?.payload && message.payload?.body?.data) ||
          (message?.payload?.parts ? findHtmlBody(message?.payload.parts) : "") ||
          message?.payload?.parts?.[0]?.body?.data ||
          ""; // Fallback to first part

        if (!bodyData) {
          console.log("⚠️ Driver: No email body data found");
        } else {
          console.log("✓ Driver: Found email body data");
        }

        // Process the body content
        console.log("🔄 Driver: Processing email body...");
        const decodedBody = fromBinary(bodyData);
        const processedHtml = createEmailHtml(decodedBody);

        console.log("✅ Driver: Email processing complete", {
          hasBody: !!bodyData,
          hasProcessedHtml: !!processedHtml,
          processedHtmlLength: processedHtml.length,
          decodedBodyLength: decodedBody.length,
        });

        // Create the full email data
        const parsedData = parse(message as any);
        const fullEmailData = {
          ...parsedData,
          body: bodyData,
          processedHtml,
          blobUrl: `data:text/html;charset=utf-8,${encodeURIComponent(processedHtml)}`,
        };

        // Log the result for debugging
        console.log("📧 Driver: Returning email data", {
          id: fullEmailData.id,
          hasBody: !!fullEmailData.body,
          hasProcessedHtml: !!fullEmailData.processedHtml,
          hasBlobUrl: !!fullEmailData.blobUrl,
          blobUrlLength: fullEmailData.blobUrl.length,
        });
        return fullEmailData;
      });

      return messages;
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
  provider: keyof typeof SupportedProviders | string,
  config: IConfig,
): MailManager => {
  const factory = SupportedProviders[provider as keyof typeof SupportedProviders];
  if (!factory) throw new Error("Provider not supported");
  switch (provider) {
    case "google":
      return factory(config);
    default:
      throw new Error("Provider not supported");
  }
};
