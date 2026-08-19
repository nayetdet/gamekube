'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="grid min-h-screen place-items-center bg-slate-950 p-6 font-sans text-slate-100">
        <main className="max-w-md rounded-2xl border border-rose-300/20 bg-rose-300/10 p-8 text-center">
          <h1 className="text-2xl font-semibold">Algo inesperado aconteceu</h1>
          <p className="mt-3 text-slate-300">
            Tente carregar a página novamente.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950"
          >
            Tentar novamente
          </button>
        </main>
      </body>
    </html>
  );
}
