import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  // Read the 'NEXT_LOCALE' cookie (or any custom locale cookie you use)
  const localeCookie = cookies().get('NEXT_LOCALE')?.value || 'en';
  const locale = localeCookie;

  //   const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
