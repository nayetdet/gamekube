'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/async-states';
import { clearTokens } from '@/lib/oidc';
import { usersService } from '@/services/users-service';

export function UserActions({
  username,
  self = false,
}: {
  username: string;
  self?: boolean;
}) {
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  async function resetEmail() {
    setEmailLoading(true);
    setFeedback(null);
    try {
      await usersService.resetEmail(username);
      setFeedback({
        type: 'success',
        message:
          'O Keycloak enviará as instruções para atualizar o e-mail cadastrado.',
      });
    } catch (reason) {
      setFeedback({
        type: 'error',
        message:
          reason instanceof Error
            ? reason.message
            : 'Não foi possível solicitar a atualização de e-mail.',
      });
    } finally {
      setEmailLoading(false);
    }
  }

  async function deleteUser() {
    setDeleteLoading(true);
    setFeedback(null);
    try {
      await usersService.delete(username);
      if (self) clearTokens();
      router.replace(self ? '/' : '/admin/users');
    } catch (reason) {
      setFeedback({
        type: 'error',
        message:
          reason instanceof Error
            ? reason.message
            : 'Não foi possível excluir o usuário.',
      });
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-semibold">E-mail de acesso</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          O e-mail é gerenciado pelo Keycloak. Solicite o envio das instruções
          para alterá-lo com segurança.
        </p>
        <Button
          type="button"
          variant="secondary"
          loading={emailLoading}
          onClick={() => void resetEmail()}
          className="mt-4"
        >
          Solicitar atualização de e-mail
        </Button>
      </section>
      <section className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.04] p-5">
        <h3 className="font-semibold text-rose-100">Zona de perigo</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          A exclusão remove o usuário da aplicação e do provedor de identidade.
          Esta ação não pode ser desfeita.
        </p>
        {confirmDelete ? (
          <div className="mt-4 rounded-xl border border-rose-300/15 bg-slate-950/40 p-4">
            <p className="text-sm text-rose-100">
              Confirmar a exclusão de <strong>{username}</strong>?
            </p>
            <div className="mt-3 flex gap-3">
              <Button
                type="button"
                variant="danger"
                loading={deleteLoading}
                onClick={() => void deleteUser()}
              >
                Excluir definitivamente
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="danger"
            onClick={() => setConfirmDelete(true)}
            className="mt-4"
          >
            Excluir usuário
          </Button>
        )}
      </section>
    </div>
  );
}
