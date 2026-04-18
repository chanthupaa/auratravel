import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AuraTravel — Discover Your World, Redefined",
  description: "Exclusive journeys. Immersive travel. A new era of luxury.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#000000" }}>
        {children}
      </body>
    </html>
  );
}
