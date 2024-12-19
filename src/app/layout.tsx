// src/app/layout.tsx

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Menu from '@/components/Menu';
import { MyContextProvider } from '../context/MyContextProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: "Danae's App",
  description: 'Created for Danae',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <MyContextProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <nav>
              <Menu />
            </nav>
            <main className="flex-1 p-4 bg-center">
              {children}
            </main>
          </div>
        </MyContextProvider>
      </body>
    </html>
  );
}
