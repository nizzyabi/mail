export const getCookie = (key: string): string | null => {
  const _cookies = Object.fromEntries(
    document.cookie.split("; ").map((v) => v.split(/=(.*)/s).map(decodeURIComponent)),
  );
  return _cookies?.[key] ?? null;
};
