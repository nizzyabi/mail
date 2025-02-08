export const getCookie = (key: string): string | null => {
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((v) => v.split(/=(.*)/s).map(decodeURIComponent)),
  );
  return cookies?.[key] ?? null;
};
