import en from "./messages/en.json";

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

// Type to use to have completion for localization keys
export type MessageKey = MessageKeys<IntlMessages, NestedKeyOf<IntlMessages>>;
