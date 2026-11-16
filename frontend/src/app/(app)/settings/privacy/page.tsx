import type { Metadata } from 'next';
import { ShieldAlertIcon } from 'lucide-react';
import { getViewer } from '@/server/viewer';
import { DeleteAccountDialog } from '@/components/user/delete-account-dialog';

export const metadata: Metadata = { title: 'Privacidade · Configurações' };

export default async function PrivacySettingsPage() {
  const { user } = await getViewer();
  return (
    <section
      aria-labelledby="privacy-settings-title"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <h2 id="privacy-settings-title" className="text-lg font-bold">
          Privacidade
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie as opções relacionadas à sua conta e aos seus dados.
        </p>
      </div>
      <div className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-start sm:px-7">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <ShieldAlertIcon className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">Excluir conta</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Exclua sua conta e seus dados. Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="sm:pt-1">
          <DeleteAccountDialog username={user.username} />
        </div>
      </div>
    </section>
  );
}
