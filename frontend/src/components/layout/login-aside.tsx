import { GaugeIcon, Rocket, UsersRound } from 'lucide-react';
import { site } from '@/config/site';
import { BrandMark } from './brand-mark';

const highlights = [
  {
    icon: Rocket,
    text: 'Servidores de jogo provisionados no Kubernetes, sob demanda.',
  },
  { icon: UsersRound, text: 'Pedidos de amizade, listas e presença ao vivo.' },
  { icon: GaugeIcon, text: 'Uma sessão por jogador, pronta em segundos.' },
];

export function LoginAside() {
  return (
    <aside className="surface-aurora-strong relative hidden flex-col justify-between border-r border-border p-12 lg:flex">
      <div className="flex items-center gap-3">
        <BrandMark className="size-12" />
        <span className="text-2xl font-extrabold tracking-tight text-brand-950">
          {site.name}
        </span>
      </div>

      <div className="max-w-md space-y-6">
        <h2 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-brand-950">
          Crie um jogo e chame seus amigos.
        </h2>
        <p className="text-brand-900/70">{site.description}</p>
        <ul className="space-y-3">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/70 text-brand-600">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="text-brand-900/80">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="font-mono text-xs text-brand-900/50">
        {site.name} · SSO Keycloak
      </p>
    </aside>
  );
}
