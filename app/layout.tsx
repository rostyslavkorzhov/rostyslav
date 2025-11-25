import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/utils/cn';
import { Provider as TooltipProvider } from '@/components/ui/tooltip';
import { NotificationProvider } from '@/components/ui/notification-provider';
import Header from '@/components/header';

const switzer = localFont({
  src: './fonts/Switzer-Variable.woff2',
  variable: '--font-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMono[wght].woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with AlignUI design system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(switzer.variable, geistMono.variable, 'antialiased')}
    >
      <body className='bg-bg-white-0 text-text-strong-950'>
        <ThemeProvider attribute='class'>
          <TooltipProvider>
            <div className='flex min-h-screen flex-col'>
              <Header />
              <main className='flex flex-1 flex-col'>{children}</main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <NotificationProvider />
      </body>
    </html>
  );
}
