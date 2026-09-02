export type GameSession = {
  url: string;
};

export const gameCatalog = [
  {
    slug: 'cavestory',
    title: 'Cave Story',
    year: 2004,
    studio: 'Studio Pixel',
    blurb:
      'O Metroidvania gratuito que começou tudo — corra, pule e atire pela ilha flutuante.',
    accent: 'from-brand-500 to-brand-700',
    cover: '/games/cavestory.jpg',
    ratio: 4 / 3,
  },
] as const;

export type GameDefinition = (typeof gameCatalog)[number];

export type GameSlug = GameDefinition['slug'];

export function findGame(slug: string): GameDefinition | undefined {
  return gameCatalog.find((game) => game.slug === slug);
}

export function parseSessionUrl(value: unknown, domain: string): string | null {
  if (typeof value !== 'string') return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  const trusted =
    url.hostname === domain || url.hostname.endsWith(`.${domain}`);
  return trusted ? url.toString() : null;
}
