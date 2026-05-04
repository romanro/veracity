import { TopicApi } from '@/core/api/apis/Topic.api';
import { type TGetTopicVersionArgumentProps } from './getTopicVersionArgument.models';

import { getQueryClient } from '@core/providers/ReactQueryProvider/ReactQueryProvider.utils';
import { type TTopic } from '@/core/models/Topic.model';
import { type TVersion } from '@/core/models/Version.model';
import { type TArgument } from '@/core/models/Argument.model';
import { ArgumentApi } from '@/core/api/apis/Argument.api';

export const getTopicVersionArgument = async ({
  locale,
  topicId,
  versionId,
  argumentId,
}: TGetTopicVersionArgumentProps) => {
  const queryClient = getQueryClient();

  let topicData: TTopic | undefined = undefined;
  let versionData: TVersion | undefined = undefined;
  let argumentData: TArgument | undefined = undefined;

  if (topicId) {
    await queryClient.prefetchQuery({
      queryKey: ['topic', topicId, locale],
      queryFn: () => TopicApi.getById(topicId?.toString(), { locale: locale ?? 'en' }),
    });

    topicData = queryClient.getQueryData(['topic', topicId, locale]) as TTopic;

    if (versionId && topicData) {
      versionData = topicData.versions?.find((v) => v.id == versionId) ?? ({} as TVersion);
    }
  }

  if (argumentId) {
    await queryClient.prefetchQuery({
      queryKey: ['argument', argumentId, locale],
      queryFn: () => ArgumentApi.getById(argumentId?.toString(), { locale: locale ?? 'en' }),
    });

    argumentData = queryClient.getQueryData(['argument', argumentId, locale]) as TArgument;
  }

  return { topicData, versionData, argumentData, queryClient };
};
