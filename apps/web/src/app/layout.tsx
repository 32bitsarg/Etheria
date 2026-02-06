import type { Metadata } from "next";
import { Cinzel_Decorative, MedievalSharp } from 'next/font/google';
import "./globals.css";
import { Providers } from "./providers";
import { APP_CONFIG } from "@/lib/app-config";

const cinzelDecorative = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const medievalSharp = MedievalSharp({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} - Juego de Estrategia`,
  description: APP_CONFIG.description,
  icons: {
    icon: APP_CONFIG.icon,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cinzelDecorative.variable} ${medievalSharp.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
