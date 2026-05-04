import type { TNewOpinionCreationTabProps } from '../NewOpinionCreationTab.types';

export type TNewOpinionTopicVersionCardProps = {
  topic?: TNewOpinionCreationTabProps['topic'];
  version?: TNewOpinionCreationTabProps['version'];
  onPublish?: () => void;
  onCancel?: () => void;
  isTreeValid?: boolean;
  isPublishing?: boolean;
};
