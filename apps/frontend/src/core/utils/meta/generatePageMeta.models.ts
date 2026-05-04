import { type TTopic } from '@/core/models/Topic.model';
import { type TLocale } from '@/i18n/i18n.models';
import { type Metadata } from 'next';

export type TGeneratePageMetaParams = {
  locale: TLocale;
  route: string;
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  ogTitleKey?: string;
  ogDescriptionKey?: string;
  twitterTitleKey?: string;
  twitterDescriptionKey?: string;
  siteName?: string;
  baseUrl?: string;
  namespace?: string;
};

export type TGeneratePageMetaFunction = (params: TGeneratePageMetaParams) => Promise<Metadata>;

export type TGenerateTopicPageMetaFunction = (params: TGeneratePageMetaParams & { topic: TTopic }) => Promise<Metadata>;
