// src/app/layout.js
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import { Alert } from '@/components/common/Alert'
import { AuthWrapper } from '../components/Auth/AuthWrapper'

import './globals.css';

export const metadata = {
  title: 'Monitoring Panel',
  description: 'Modern analytics dashboard solution',
};

export default async function RootLayout({ children }) {

  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') || 'ru';

  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}"`, error);
    messages = (await import('@/messages/ru.json')).default;
  }

  return (
    <html lang={locale}>
      <body>
        <AuthWrapper>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Alert />
        </AuthWrapper>
      </body>
    </html>
  );
}

