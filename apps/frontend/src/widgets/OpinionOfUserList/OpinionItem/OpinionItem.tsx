import { type FC } from 'react';
import { type TOpinionItemProps } from './OpinionItem.models';
import { ArgumentSummary } from '../../ArgumentsList/ArgumentSummary/ArgumentSummary';
import { HeadingSummary } from './HeadingSummary';

export const OpinionItem: FC<TOpinionItemProps> = ({ item }) => {
  const { type = 'argument' } = item;
  const itemType = type ?? 'argument';
  const isArgument = itemType === 'argument' || itemType === 'text';

  return (
    <li key={item.id}>
      {isArgument ? <ArgumentSummary argument={item} /> : <HeadingSummary item={item} />}
    </li>
  );
};
