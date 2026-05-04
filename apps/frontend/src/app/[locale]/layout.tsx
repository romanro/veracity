import React, { type ReactNode } from 'react';
import { StoreProvider } from '@/core/providers/StoreProvider';
import { ClientReactQueryProvider } from '@/core/providers/ReactQueryProvider/ClientReactQueryProvider';
import { I18nProvider } from '@/core/providers/I18nProvider';
import { getServerTranslations } from '@/i18n/serverInit';
import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const AppHeader = dynamic(() => import('@/widgets/AppHeader').then((mod) => mod.AppHeader), {
  ssr: true,
  loading: () => <ShimmerPlaceholder height={60} />,
});

const ToastContainer = dynamic(
  () => import('@/libs/ui-components/Toast/ToastContainer').then((mod) => mod.ToastContainer),
  {
    ssr: true,
    loading: () => null,
  }
);

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const dehydratedState = null;
  const resources = await getServerTranslations(locale);

  return (
    <I18nProvider locale={locale} resources={resources}>
      <StoreProvider>
        <ClientReactQueryProvider dehydratedState={dehydratedState}>
          <AppHeader params={resolvedParams} />
          {children}
          <ToastContainer />
        </ClientReactQueryProvider>
      </StoreProvider>
    </I18nProvider>
  );
}
