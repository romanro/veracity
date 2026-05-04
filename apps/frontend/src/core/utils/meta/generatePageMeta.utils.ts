import { initServerI18n } from '@/i18n/serverInit';
import { BASE_URL, DESCRIPTION_KEY, NAMESPACE, SITE_NAME, TITLE_KEY } from './metadata.consts';
import { i18nConfig } from '@/i18n/config';
import { type TGeneratePageMetaFunction } from './generatePageMeta.models';

export const generatePageMeta: TGeneratePageMetaFunction = async ({
  locale,
  namespace = NAMESPACE,
  route,
  title,
  titleKey = TITLE_KEY,
  description,
  descriptionKey = DESCRIPTION_KEY,
  ogTitleKey,
  ogDescriptionKey,
  twitterTitleKey,
  twitterDescriptionKey,
  siteName = SITE_NAME,
  baseUrl = BASE_URL,
}) => {
  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, ['metadata', namespace]);

  const canonicalUrl = `${baseUrl}/${locale}${route}`;

  // OG + Twitter
  const ogTitle = title ?? t(ogTitleKey ?? titleKey);
  const ogDescription = description ?? t(ogDescriptionKey ?? descriptionKey);
  const twitterTitle = title ?? t(twitterTitleKey ?? titleKey);
  const twitterDescription = description ?? t(twitterDescriptionKey ?? descriptionKey);

  const languages = Object.fromEntries(
    i18nConfig.locales.map((loc) => [loc, loc === 'en' ? `${baseUrl}${route}` : `${baseUrl}/${loc}${route}`])
  );

  return {
    title: title ?? t(titleKey),
    description: description ?? t(descriptionKey),

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName,
      locale,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
    },

    metadataBase: new URL(baseUrl),
    keywords: t('keywords'),
  };
};
