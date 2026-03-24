import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مكتوب - اصنع روايتك',
  description: 'توليد روايات احترافية باستخدام الذكاء الاصطناعي من فكرة بسيطة عبر منصة مكتوب.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
