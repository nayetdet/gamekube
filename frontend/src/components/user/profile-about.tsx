import type { User } from '@/entities/user/user.entity';

export function ProfileAbout({ user }: { user: User }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-bold">Sobre</h2>
      <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
        {user.description?.trim() || 'Nenhuma biografia configurada ainda.'}
      </p>
    </section>
  );
}
