import en from "./messages/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

// Define `MessageKeys` for the `useMessages()` hook of `next-intl`
export type MessageKey = MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
