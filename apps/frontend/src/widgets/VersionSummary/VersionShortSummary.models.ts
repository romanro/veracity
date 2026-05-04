import { type TVersion } from '@core/models/Version.model';

export type TVersionShortSummaryProps = {
  version: TVersion;
  index: number;
  topicId?: string | number;
};
