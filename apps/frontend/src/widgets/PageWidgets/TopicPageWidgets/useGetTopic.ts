import { TopicApi } from '@/core/api/apis/Topic.api';
import { useQuery } from '@tanstack/react-query';

type TUseGeTopicParams = { topicId?: string; locale?: string };

export const useGetTopic = ({ topicId, locale }: TUseGeTopicParams) => {
  return useQuery({
    queryKey: ['topic', topicId, locale],
    queryFn: () => TopicApi.getById(topicId),
    staleTime: 1000,
    enabled: Boolean(topicId),
  });
};
