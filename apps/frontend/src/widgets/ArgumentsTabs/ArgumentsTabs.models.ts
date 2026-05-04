import { type TAuthor } from '@core/models/Author.model';
import { type TArgument } from '@core/models/Argument.model';

export type TArgumentsTabsProps = {
  isLoading: boolean;
  args: TArgument[];
  authors?: TAuthor[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  versionId?: string;
};
