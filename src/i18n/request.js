// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({url}) => {
  const pathname = new URL(url, 'http://localhost').pathname;

  const supportedLocales = ['en', 'ru'];
  const firstSegment = pathname.split('/')[1];

  const locale = supportedLocales.includes(firstSegment) ? firstSegment : 'en';

  return {
    locale
  };
});
