import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/shared/ui/Toaster';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Стоп-лист кухни',
  description: 'Панель стоп-листа смены',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
