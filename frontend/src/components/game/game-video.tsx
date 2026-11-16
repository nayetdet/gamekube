function videoSource(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    if (
      [
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'www.youtube-nocookie.com',
      ].includes(url.hostname)
    ) {
      id =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : (url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)\/?$/)?.[1] ??
            null);
    }
    if (id && /^[\w-]{11}$/.test(id))
      return {
        kind: 'youtube' as const,
        url: `https://www.youtube-nocookie.com/embed/${id}`,
        original: url.href,
      };
    if (/\.(mp4|webm|ogg)$/i.test(url.pathname))
      return { kind: 'file' as const, url: url.href, original: url.href };
    return { kind: 'link' as const, url: url.href, original: url.href };
  } catch {
    return null;
  }
}

export function GameVideo({
  url,
  name,
}: {
  url?: string | null;
  name: string;
}) {
  const video = url ? videoSource(url) : null;
  if (!video) return null;
  return (
    <section className="space-y-4 border-t border-border p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-bold">Conheça o jogo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Veja o vídeo de demonstração antes de jogar.
        </p>
      </div>
      <div className="mx-auto w-full max-w-5xl space-y-3">
        {video.kind === 'youtube' && (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={video.url}
              title={`Vídeo de demonstração de ${name}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
        {video.kind === 'file' && (
          <video
            className="aspect-video w-full rounded-xl bg-black"
            src={video.url}
            controls
            preload="metadata"
          >
            <track kind="captions" />
            Seu navegador não suporta vídeo.
          </video>
        )}
        <a
          href={video.original}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Abrir vídeo em outra aba
        </a>
      </div>
    </section>
  );
}
