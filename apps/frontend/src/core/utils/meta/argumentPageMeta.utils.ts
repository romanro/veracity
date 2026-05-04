import { type TArgument } from '@/core/models/Argument.model';
import { type TTopic } from '@core/models/Topic.model';
import { type TVersion } from '@core/models/Version.model';
import { type Metadata } from 'next';

type GenerateArgumentPageMetaParams = {
  t: (key: string) => string;
  topic?: TTopic;
  version?: TVersion;
  argument?: TArgument;
};

export function generateArgumentPageMeta({ t, topic, version, argument }: GenerateArgumentPageMetaParams): Metadata {
  let title = t(`title`);
  let description = '';

  if (argument) {
    const { title: argumentTitle } = argument;
    title += `: Argument "${argumentTitle}"`;
    description += `Argument "${argumentTitle}"`;
  }

  if (version?.title) {
    const { title: versionTitle, description: versionDescription } = version;
    title += `: Version "${versionTitle}"`;
    description += `Version "${versionDescription ?? versionTitle}"`;
  }

  if (topic?.title) {
    const { title: topicTitle, subject } = topic;
    title += ` for topic "${topicTitle}"`;
    description += ` for topic "${subject ?? topicTitle}"`;
  }

  return {
    title,
    description,
  };
}
