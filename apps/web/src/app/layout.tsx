import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Raizes do Nordeste',
  description: 'Plataforma de gestao gastronomica nordestina',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
