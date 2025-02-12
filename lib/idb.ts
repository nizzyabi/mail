"use client";
import Dexie, { type EntityTable } from "dexie";
import { ParsedMessage } from "@/types";

const idb = new Dexie("mail0") as Dexie & {
  threads: EntityTable<
    ParsedMessage,
    "id" // primary key "id" (for the typings only)
  >;
};

idb.version(1).stores({
  threads: "++id, title, tags, sender, receivedOn, unread, body, processedHtml, blobUrl, q", // primary key "id" (for the runtime!)
});

export { idb };
