import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { i18nConfig } from '@/i18n/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const SUPPORTED_LOCALES = i18nConfig.locales;
const DEFAULT_LOCALE = i18nConfig.defaultLocale;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const hasClerkHandshake =
    !!resolvedParams?.__clerk_handshake || !!resolvedParams?.__clerk_status;

  if (hasClerkHandshake) {

    return (
      <main style={{ padding: 24, fontFamily: 'system-ui' }}>
        Signing you in…
      </main>
    );
  }


  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;

  if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie as any)) {
    redirect(`/${localeCookie}`);
  }

  const hdrs = await headers();
  const acceptLang = hdrs.get('accept-language');
  const browserLocale = acceptLang?.split(',')[0]?.split('-')[0];

  const resolvedLocale =
    browserLocale && SUPPORTED_LOCALES.includes(browserLocale as any)
      ? browserLocale
      : DEFAULT_LOCALE;

  redirect(`/${resolvedLocale}`);
}