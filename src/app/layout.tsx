
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LocalizationProvider } from '@/context/LocalizationContext';

export const metadata: Metadata = {
  title: 'The Grid',
  description: 'Real-Time Public Crisis Reporting and Management System',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LocalizationProvider>
          {children}
          <Toaster />
        </LocalizationProvider>
      </body>
    </html>
  );
}
