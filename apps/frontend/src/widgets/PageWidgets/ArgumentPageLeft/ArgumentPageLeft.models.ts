import { type TArgument } from '@/core/models/Argument.model';
import { type TTopic } from '@/core/models/Topic.model';
import { type TVersion } from '@/core/models/Version.model';

export type TArgumentPageLeftProps = {
  topic: TTopic;
  version: TVersion;
  argument: TArgument;
  typeArguments: string | number;
  onClickCanel?: () => void;
};
