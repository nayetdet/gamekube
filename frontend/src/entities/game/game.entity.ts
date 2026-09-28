export type GameSession = {
  url: string;
};

export type GameDefinition = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export function parseSessionUrl(value: unknown, domain: string): string | null {
  if (typeof value !== 'string') return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  const trusted =
    url.hostname === domain || url.hostname.endsWith(`.${domain}`);
  return trusted ? url.toString() : null;
}
