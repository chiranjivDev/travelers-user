import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutContent from '@/components/RootLayoutContent';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import '/node_modules/flag-icons/css/flag-icons.min.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeliveryConnect - Connect Travelers with Package Senders',
  description:
    'Save money on shipping by connecting with travelers heading to your destination. Join our community of trusted travelers and senders.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get startedF
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <body
        className={`${inter.className} min-h-screen bg-[#0f172a] text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <RootLayoutContent>{children}</RootLayoutContent>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
