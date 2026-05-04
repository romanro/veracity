import { type Metadata } from 'next';
import { CONTAINER_CLASSES } from '../styles/tailwind/container.consts';
import { HomePageInfoBlocksLazy } from '@widgets/PageWidgets/HomePageWidgets/HomePageInfoBlocks.lazy';
import { HomePageTabsLazy } from '@widgets/PageWidgets/HomePageWidgets/HomePageTabs.lazy';
import { initServerI18n } from '@/i18n/serverInit';
import { generateMainPageMeta } from '@/core/utils/meta/mainPageMeta.utils';
import { type TLocale } from '@/i18n/i18n.models';
import classNames from 'classnames';

export async function generateMetadata({ params }: { params: Promise<{ locale: TLocale }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return generateMainPageMeta({ locale, route: '/' });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'mainPage');

  return (
    <main className='flex-center'>
      <section className={classNames(CONTAINER_CLASSES, 'gap-[18px]')}>
        <h1 className='pageHeader'>{t('title')}</h1>
        <h2 className='pageHeader'>{t('subtitle')}</h2>
      </section>

      <HomePageInfoBlocksLazy />
      <HomePageTabsLazy />
    </main>
  );
}
