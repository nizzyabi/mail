"use server";

import { Locale, defaultLocale, locales } from "../i18n/config";
import { I18N_LOCALE_COOKIE_NAME } from "@/lib/constants";
import { cookies, headers } from "next/headers";

export async function getUserLocale() {
  const _headers = await headers();
  const _cookies = await cookies();

  // we only want the first section
  const browserLanguage = _headers.get("accept-language")?.split(",")[0];
  return _cookies.get(I18N_LOCALE_COOKIE_NAME)?.value || getBrowserLocale(browserLanguage);
}

export async function setUserLocale(locale: Locale) {
  const _cookies = await cookies();
  _cookies.set(I18N_LOCALE_COOKIE_NAME, locale);
}

const getBrowserLocale = (locale: string | undefined): string => {
  if (!locale) return defaultLocale;

  const isSupported = locales.some((l) => locale.includes(l));
  if (!isSupported) return defaultLocale;

  // if the region is included in the string, we remove it.
  const indexOfDash = locale.indexOf("-");
  return indexOfDash !== -1 ? locale.substring(0, indexOfDash) : locale;
};
