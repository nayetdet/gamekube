'use client';

import { useState } from 'react';
import Link from 'next/link';
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

type StageToolbarProps = {
  url: string;
  title: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
};

const button =
  'text-background/70 hover:bg-background/15 hover:text-background';

export function StageToolbar({
  url,
  title,
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
    <div className="flex h-12 shrink-0 items-center gap-2 px-3">
      <Button asChild variant="ghost" size="icon-sm" className={button}>
        <Link href={routes.games} aria-label="Voltar aos jogos">
          <ArrowLeftIcon aria-hidden />
        </Link>
      </Button>

      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-background">
        <span className="size-2 shrink-0 rounded-full bg-online" aria-hidden />
        <span className="truncate">{title}</span>
        <span className="hidden text-background/50 sm:inline">
          · sessão ativa
        </span>
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1">
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
