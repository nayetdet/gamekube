'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SaveControls({ id }: { id: string }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const url = `/api/games/${encodeURIComponent(id)}/save`;
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <a href={url} className="underline">
        Baixar save
      </a>
      <button
        type="button"
        className="underline disabled:opacity-50"
        disabled={busy}
        onClick={async () => {
          if (
            !window.confirm(
              'Excluir o save deste jogo? Esta ação não pode ser desfeita.',
            )
          )
            return;
          setBusy(true);
          setMessage('');
          try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
              setMessage(
                response.status === 409
                  ? 'Encerre o jogo antes de excluir o save.'
                  : 'Não foi possível excluir o save.',
              );
              return;
            }
            router.refresh();
          } catch {
            setMessage('Não foi possível excluir o save.');
          } finally {
            setBusy(false);
          }
        }}
      >
        Excluir save
      </button>
      {message && <span role="status">{message}</span>}
    </div>
  );
}
