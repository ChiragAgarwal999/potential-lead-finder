import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning avoids false-positive hydration mismatches caused by
        browser extensions mutating <body> attributes before React hydration.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
