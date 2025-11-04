// src/middleware.js
import { NextResponse } from 'next/server';

const supportedLocales = ['en', 'ru'];
const defaultLocale = 'ru';

export function middleware(request) {
  const response = NextResponse.next();

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  const locale = supportedLocales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  response.headers.set('x-next-intl-locale', locale);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico).*)'],
};
