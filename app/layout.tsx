import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Family Shopping List",
  description: "Shared shopping list for families",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iPhone splash */}
        <link rel="apple-touch-startup-image" href="/splash.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>

      <body>
        {children}

        {/* Service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/service-worker.js");
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
