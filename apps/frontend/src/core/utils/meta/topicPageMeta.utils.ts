import { generatePageMeta } from './generatePageMeta.utils';
import { type TGenerateTopicPageMetaFunction } from './generatePageMeta.models';
import { initServerI18n } from '@/i18n/serverInit';

export const generateTopicPageMeta: TGenerateTopicPageMetaFunction = async ({ topic, locale, ...params }) => {
  const { title: topicTitle, subject } = topic;

  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, ['metadata']);

  const title = topicTitle ? `${t('shortTitle')} - ${topicTitle}` : undefined;
  const description = subject ? `${t('shortDescription')}: ${subject}` : undefined;

  return generatePageMeta({ locale, title, description, ...params });
};
