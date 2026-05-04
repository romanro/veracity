// app/versions/[versionId]/arguments/[argumentId]

import ArgumentPage from '@/app/[locale]/topics/[topicId]/versions/[versionId]/arguments/[argumentId]/page';
import { generateMetadata as originalGenerateMetadata } from '@/app/[locale]/topics/[topicId]/versions/[versionId]/arguments/[argumentId]/page';

export const generateMetadata = originalGenerateMetadata;

export default function ArgumentsPageProxy({
  params,
}: {
  params: Promise<{ locale: string; topicId?: string; versionId?: string; argumentId: string }>;
}) {
  return <ArgumentPage params={Promise.resolve({ ...params, topicId: undefined })} />;
}
