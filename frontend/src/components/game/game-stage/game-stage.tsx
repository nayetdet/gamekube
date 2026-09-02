'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { StageToolbar } from './stage-toolbar';

type GameStageProps = {
  url: string;
  title: string;
  ratio: number;
};

export function GameStage({ url, title, ratio }: GameStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current?.requestFullscreen();
    } catch {
      toast.error('Seu navegador não permitiu a tela cheia.');
    }
  }

  return (
    <div ref={stage} className="flex h-dvh flex-col bg-foreground">
      <StageToolbar
        url={url}
        title={title}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="flex flex-1 items-center justify-center overflow-hidden bg-black">
        <div
          className="relative w-[min(100%,calc((100dvh-3rem)*var(--ratio)))]"
          style={
            { '--ratio': ratio, aspectRatio: ratio } as React.CSSProperties
          }
        >
          <iframe
            src={url}
            title={`Sessão de ${title}`}
            allow="fullscreen; gamepad; autoplay"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
