import { Sidebar } from '@/components/layout/sidebar';

const viewer = {
  name: 'Isaac Nayet',
  username: 'admina',
  status: 'ONLINE' as const,
};

export default function PreviewPage() {
  return (
    <div className="flex min-h-svh">
      <aside className="w-68 shrink-0 border-r border-sidebar-border">
        <div className="sticky top-0 h-svh">
          <Sidebar viewer={viewer} role="Administrador" canSeeAdmin />
        </div>
      </aside>
      <main className="flex-1 space-y-4 p-8">
        <div className="rounded-xl bg-card p-6 ring-1 ring-border">
          Conteúdo, para comparar a superfície do rail com a da página.
        </div>
      </main>
    </div>
  );
}
