import { type TVersion } from '@core/models/Version.model';

export type TVersionsListProps = {
  versions: TVersion[];
  isLoading: boolean;
};
