import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { APP_CONFIG } from "@/lib/app-config";

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
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
