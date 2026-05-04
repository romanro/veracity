// app/versions/[versionId]/consensus/

import ConsensusPage from '@/app/[locale]/topics/[topicId]/versions/[versionId]/consensus/page';
import { generateMetadata as originalGenerateMetadata } from '@/app/[locale]/topics/[topicId]/versions/[versionId]/consensus/page';

export const generateMetadata = originalGenerateMetadata;

export default async function ConsensusPageProxy({
  params,
}: {
  params: Promise<{ locale: string; topicId?: string; versionId: string; argumentId?: string }>;
}) {
  const resolvedParams = await params;
  return <ConsensusPage params={Promise.resolve({ ...resolvedParams, topicId: undefined })} />;
}
