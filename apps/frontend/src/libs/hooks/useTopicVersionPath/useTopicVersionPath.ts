import { getTopicVersionPath } from '@/core/utils/path/getTopicVersionPath.util';
import { useLocaleRouter } from '../useLocaleRouter';

export const useTopicVersionPath = () => {
  const { locale } = useLocaleRouter();

  const getPath = ({
    topicId,
    versionId,
    authorId,
  }: {
    topicId?: string | number;
    versionId?: string | number;
    authorId?: string | number;
  }) => {
    return getTopicVersionPath({ locale, topicId, versionId, authorId });
  };

  return { getPath };
};
