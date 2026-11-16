import type { Metadata } from 'next';
import { MailIcon } from 'lucide-react';
import { getViewer } from '@/server/viewer';
import { EmailResetForm } from '@/components/user/email-reset-form';

export const metadata: Metadata = { title: 'Conta · Configurações' };

export default async function AccountSettingsPage() {
  const { user } = await getViewer();
  return (
    <section
      aria-labelledby="account-settings-title"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <h2 id="account-settings-title" className="text-lg font-bold">
          Conta
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os dados associados à sua conta.
        </p>
      </div>
      <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-start sm:px-7">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MailIcon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">Endereço de e-mail</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Enviaremos um link para seu e-mail atual para confirmar a alteração.
          </p>
        </div>
        <div className="sm:pt-1">
          <EmailResetForm username={user.username} />
        </div>
      </div>
    </section>
  );
}
