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
  title: `${APP_CONFIG.name} - ${APP_CONFIG.description}`,
  description: APP_CONFIG.description,
  manifest: '/manifest.json',
  themeColor: '#d4af37',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  icons: {
    icon: [
      { url: APP_CONFIG.icon, type: 'image/webp' },
    ],
    apple: [
      { url: APP_CONFIG.icon, sizes: '180x180', type: 'image/webp' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cinzelDecorative.variable} ${medievalSharp.variable}`} suppressHydrationWarning>
      <head>
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/assets/pwa/ios/apple-splash-1290-2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/assets/pwa/ios/apple-splash-1170-2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/assets/pwa/ios/apple-splash-1284-2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
