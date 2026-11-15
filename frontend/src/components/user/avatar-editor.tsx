'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AvatarEditor({ username }: { username: string }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className="space-y-2 rounded-xl border p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        setBusy(true);
        setMessage('');
        try {
          const response = await fetch(
            `/api/users/${encodeURIComponent(username)}/avatar`,
            { method: 'PUT', body: new FormData(form) },
          );
          if (!response.ok) throw new Error();
          form.reset();
          setMessage('Avatar atualizado.');
          router.refresh();
        } catch {
          setMessage(
            'Não foi possível atualizar o avatar. Confira o arquivo e tente novamente.',
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="block text-sm font-semibold" htmlFor="avatar-file">
        Alterar avatar
      </label>
      <input
        id="avatar-file"
        name="file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
        className="block text-sm"
      />
      <button
        disabled={busy}
        className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
      >
        {busy ? 'Enviando...' : 'Salvar avatar'}
      </button>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
