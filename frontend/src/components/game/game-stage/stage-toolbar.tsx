'use client';

import { useState } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
} from 'lucide-react';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { EndGameForm } from '../end-game-form';
import { BackLink } from '@/components/common/back-link';

type StageToolbarProps = {
  url: string;
  title: string;
  gameId: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

const button = 'text-muted-foreground hover:bg-muted hover:text-foreground';

export function StageToolbar({
  url,
  title,
  gameId,
  fullscreen,
  onToggleFullscreen,
}: StageToolbarProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
      <Button asChild variant="ghost" size="icon-sm" className={button}>
        <BackLink fallback={routes.games} aria-label="Voltar">
          <ArrowLeftIcon aria-hidden />
        </BackLink>
      </Button>

      <span className="min-w-0 truncate text-xs font-semibold text-foreground">
        {title}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <EndGameForm id={gameId} />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={copy}
          aria-label="Copiar link da sessão"
          className={button}
        >
          {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
        </Button>

        <Button asChild variant="ghost" size="icon-sm" className={button}>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Abrir a sessão em uma nova aba"
          >
            <ExternalLinkIcon aria-hidden />
          </a>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onToggleFullscreen}
          aria-label={fullscreen ? 'Sair da tela cheia' : 'Expandir a tela'}
          className={button}
        >
          {fullscreen ? (
            <MinimizeIcon aria-hidden />
          ) : (
            <MaximizeIcon aria-hidden />
          )}
        </Button>
      </div>
    </div>
  );
}
