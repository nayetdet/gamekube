'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/async-states';
import { usersService } from '@/services/users-service';
import type { User } from '@/types/api';

interface UserFormProps {
  user: User;
  onSaved: (updatedUsername: string) => Promise<void> | void;
}

export function UserForm({ user, onSaved }: UserFormProps) {
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name ?? '');
  const [description, setDescription] = useState(user.description ?? '');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim().length < 3) {
      setFeedback({
        type: 'error',
        message: 'O nome de usuário deve ter pelo menos 3 caracteres.',
      });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      await usersService.update(user.username, {
        username: username.trim(),
        name: name.trim() || null,
        description: description.trim() || null,
      });
      await onSaved(username.trim());
      setFeedback({
        type: 'success',
        message: 'Dados atualizados com sucesso.',
      });
    } catch (reason) {
      setFeedback({
        type: 'error',
        message:
          reason instanceof Error
            ? reason.message
            : 'Não foi possível salvar os dados.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Nome de usuário
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            maxLength={50}
            required
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60 focus:ring-2 focus:ring-cyan-200/15"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-200">
          Nome de exibição
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            placeholder="Como você quer ser chamado"
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60 focus:ring-2 focus:ring-cyan-200/15"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-200">
        Sobre você
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Conte um pouco sobre você"
          className="resize-y rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/60 focus:ring-2 focus:ring-cyan-200/15"
        />
        <span className="text-right text-xs font-normal text-slate-500">
          {description.length}/1000
        </span>
      </label>
      {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}
      <Button type="submit" loading={loading}>
        Salvar alterações
      </Button>
    </form>
  );
}
