import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/auth/providers';

export const metadata: Metadata = {
  title: 'GameKube',
  description: 'Inicie e gerencie suas experiências de jogo.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
