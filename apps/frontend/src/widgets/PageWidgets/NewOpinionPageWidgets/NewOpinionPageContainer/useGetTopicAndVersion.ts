import { type TMainParamsProps } from '@/core/models/main';
import { useGetTopic } from '../../TopicPageWidgets/useGetTopic';

type TProps = { mainParams: TMainParamsProps };

export const useGetTopicAndVersion = ({ mainParams }: TProps) => {
  const { topicId, versionId, locale } = mainParams;

  const { data: serverTopic, isLoading } = useGetTopic({ topicId: topicId?.toString?.(), locale });

  const serverVersion = serverTopic?.versions?.find((version) => version.id == versionId);

  return { serverTopic, serverVersion, isLoading };
};
