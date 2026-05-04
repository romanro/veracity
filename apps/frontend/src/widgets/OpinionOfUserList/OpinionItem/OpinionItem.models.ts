
import { type TAuthor } from '@core/models/Author.model';
import type { ArgumentListItem } from '@core/api/models/Argument.api.models';

export type TOpinionItemProps = {
  item: ArgumentListItem;
  author?: TAuthor;
};
