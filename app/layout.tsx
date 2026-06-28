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
        {/* PWA Splash Screen for iPhone */}
        <link rel="apple-touch-startup-image" href="/splash.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body id="app-body">
        <div className="app-container">
          {children}
        </div>

        {/* Service Worker Registration */}
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
