import { type TArgument } from '@/core/models/Argument.model';
import { type TMainParamsProps } from '@/core/models/main';
import { type TTopic } from '@/core/models/Topic.model';
import { type TVersion } from '@/core/models/Version.model';

export type TArgumentPageContainerConfirmationProps = {
  mainParams: TMainParamsProps;
  topic: TTopic;
  version: TVersion;
  argument: TArgument;
  typeArguments: string | number;
};
