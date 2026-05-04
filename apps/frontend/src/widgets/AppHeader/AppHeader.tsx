import { AppLogo } from '@libs/ui-components/AppLogo';
import { LanguageSwitcherSelect } from '@libs/ui-components/LanguageSwitcherSelect/LanguageSwitcherSelect';
import Link from 'next/link';
import { Suspense } from 'react';
import { AppHeaderUserMenu } from './AppHeaderUserMenu';
import type { FC } from 'react';
import { type TAppHeaderProps } from './AppHeader.models';
import { AppHeaderSearch } from './AppHeaderSearch';
import { AppHeaderWriteBtn } from './AppHeaderWriteBtn';
import { initServerI18n } from '@/i18n/serverInit';
import { i18nConfig } from '@/i18n/config';
import { type TLocale } from '@/i18n/i18n.models';
import { getLocalizedPath } from '@/i18n/LocaleManager.server';
import styles from './AppHeader.module.scss';

const AppHeader: FC<TAppHeaderProps> = async ({ params }) => {
  const { locale = i18nConfig.defaultLocale } = params;

  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'common');

  return (
    <header className='sticky top-0 z-50 flex h-(--header-height) items-center justify-between bg-(--color-bg-primary) px-[28px]'>
      <div className={styles.logoSearch}>
        <Link href={getLocalizedPath(locale as TLocale, '/')}>
          <AppLogo logoText={t('logo')} />
        </Link>
        <AppHeaderSearch locale={locale} placeholder={t('search')} />
      </div>

      <div className={styles.logoSearch}>
        <Suspense
          fallback={
            <div className='flex items-center gap-2'>
              <div className='h-9 w-[140px] rounded bg-(--color-light-500) animate-pulse' />
              <div className='h-8 w-8 rounded-full bg-(--color-light-500) animate-pulse' />
              <div className='h-8 w-16 rounded bg-(--color-light-500) animate-pulse' />
            </div>
          }
        >
          <AppHeaderWriteBtn label={t('write')} />
          <AppHeaderUserMenu />
          <LanguageSwitcherSelect />
        </Suspense>
      </div>
    </header>
  );
};

export { AppHeader };
