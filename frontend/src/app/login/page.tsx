import type { Metadata } from 'next';
import { LogInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/layout/brand-mark';
import { LoginAside } from '@/components/layout/login-aside';
import { site } from '@/config/site';
import { signInHref, signInError } from '@/lib/sign-in';

export const metadata: Metadata = { title: 'Entrar' };

export default async function LoginPage(props: PageProps<'/login'>) {
  const params = await props.searchParams;
  const error = signInError(params.error);

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <LoginAside />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <BrandMark className="size-12" />
            <span className="text-2xl font-extrabold tracking-tight">
              {site.name}
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              O {site.name} usa sua conta do Keycloak. Você volta direto para cá
              assim que entrar.
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg bg-destructive/8 px-3 py-2 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button asChild size="lg" className="w-full gap-2 font-bold">
            <a href={signInHref(params.redirectTo)}>
              <LogInIcon aria-hidden />
              Continuar com Keycloak
            </a>
          </Button>

          <p className="text-xs text-muted-foreground">
            Ainda não tem conta? Cadastre-se pelo Keycloak — o realm provisiona
            seu jogador do GameKube automaticamente no primeiro acesso.
          </p>
        </div>
      </div>
    </div>
  );
}
