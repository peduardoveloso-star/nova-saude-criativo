import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A Nova Saúde — Gerador de Criativos',
  description: 'Gerador de posts estáticos para Instagram com IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
