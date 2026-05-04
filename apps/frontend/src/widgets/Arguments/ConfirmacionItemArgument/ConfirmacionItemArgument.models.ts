import { type TArgument } from '@/core/models/Argument.model';

export type TConfirmationItemArgumentProps = {
  connection?: boolean;
  isLineaHorizontal?: boolean;
  topicId: string;
  versionId: string;
  item: TArgument;
};
