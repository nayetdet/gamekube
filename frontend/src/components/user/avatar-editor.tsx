'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon, PencilIcon } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarEditor({ username }: { username: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-label="Selecionar foto de perfil"
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (!file) return;
          if (
            !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
              file.type,
            )
          ) {
            toast.error('Escolha uma imagem JPEG, PNG, GIF ou WebP.');
            return;
          }
          if (file.size > 10 * 1024 * 1024) {
            toast.error('A imagem deve ter no máximo 10 MB.');
            return;
          }
          const form = new FormData();
          form.set('file', file);
          setBusy(true);
          try {
            const response = await fetch(
              `/api/users/${encodeURIComponent(username)}/avatar`,
              { method: 'PUT', body: form },
            );
            if (!response.ok) {
              if (response.status === 413)
                throw new Error('A imagem deve ter no máximo 10 MB.');
              if (response.status === 401 || response.status === 403)
                throw new Error(
                  'Sua sessão não permite alterar esta foto. Entre novamente e tente outra vez.',
                );
              throw new Error(
                'Não foi possível atualizar a foto. Tente novamente.',
              );
            }
            toast.success('Foto de perfil atualizada.');
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Não foi possível atualizar a foto. Tente novamente.',
            );
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        disabled={busy}
        aria-busy={busy}
        onClick={() => input.current?.click()}
        aria-label="Alterar foto de perfil"
        title="Alterar foto de perfil (JPEG, PNG, GIF ou WebP até 10 MB)"
        className="absolute right-0 bottom-0 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-md transition-all duration-150 hover:scale-105 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <PencilIcon className="size-4" />
        )}
      </button>
    </>
  );
}
