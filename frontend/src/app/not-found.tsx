import Link from 'next/link';
import { CompassIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="surface-aurora flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md space-y-4 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <CompassIcon className="size-6" aria-hidden />
        </span>
        <p className="font-mono text-sm font-semibold text-brand-600">404</p>
        <h1 className="text-2xl font-extrabold">Não há nada nesta URL</h1>
        <p className="text-sm text-muted-foreground">
          A página pode ter sido renomeada, ou o jogador que você procurava não
          está mais cadastrado.
        </p>
        <Button asChild className="font-semibold">
          <Link href={routes.dashboard}>Voltar ao lobby</Link>
        </Button>
      </div>
    </div>
  );
}
