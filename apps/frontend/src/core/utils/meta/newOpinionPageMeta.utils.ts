import { type TTopic } from '@core/models/Topic.model';
import { type TVersion } from '@core/models/Version.model';
import { type Metadata } from 'next';

type GenerateNewOpinionPageMetaParams = { t: (key: string) => string; topic?: TTopic; version?: TVersion };

export function generateNewOpinionPageMeta({ t, topic, version }: GenerateNewOpinionPageMetaParams): Metadata {
  const _title = t(`title`);
  const _description = '';

  if (version?.title) {
    // const { title: versionTitle, description: versionDescription } = version;
    // title += `: Version "${versionTitle}"`;
    // description += `Version "${versionDescription ?? versionTitle}"`;
  }

  if (topic?.title) {
    // const { title: topicTitle, subject } = topic;
    // title += ` for topic "${topicTitle}"`;
    // description += ` for topic "${subject ?? topicTitle}"`;
  }

  return {
    title: 'New Opinion',
    description: 'Create a new opinion on the topic',
  };
}
