import { getTopicVersionArgument } from '@/core/api/apis/utils/getTopicVersionArgument';
import { type TArgument } from '@/core/models/Argument.model';
import { type TTopic } from '@/core/models/Topic.model';
import { type TVersion } from '@/core/models/Version.model';
import { ArgumentPageContainerConfirmation } from '@/widgets/PageWidgets/ArgumentPageContainerConfirmation';

type TNewConfRefPagePageProps = {
  params: Promise<{ id: string; versionsId?: string; argumentId?: string }>;
  searchParams: Promise<{ topic: string; version: string; type: string | number }>;
};

export default async function NewConfRefPage({ params, searchParams }: TNewConfRefPagePageProps) {
  const { argumentId } = await params;
  const { topic, version, type } = await searchParams;

  const { topicData, versionData, argumentData } = await getTopicVersionArgument({
    argumentId: argumentId ?? '',
    topicId: topic,
    versionId: version,
  });

  return (
    <ArgumentPageContainerConfirmation
      mainParams={{
        argumentId: argumentId ?? '',
        topicId: topic,
        versionId: version,
      }}
      topic={topicData ?? ({} as TTopic)}
      version={versionData ?? ({} as TVersion)}
      argument={argumentData ?? ({} as TArgument)}
      typeArguments={type}
    />
  );
}
