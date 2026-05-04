import { useEffect, useMemo, useState, type FC } from 'react';
import { Tabs } from '@libs/ui-components/Tabs';
import { BadgeCheck, MessagesSquare } from 'lucide-react';
import { DropdownMenu } from '@libs/ui-components/DropdownMenu';
import { type TAuthor } from '@/core/models/Author.model';
import { type TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';
import { TabFiltersAuthor } from './TabFiltersAuthor';
import { TabFiltersConsensus } from './TabFiltersConsensus';
import { type TTabFilterProps } from './TabFilters.models';
import { useArgumentSearchParams } from '@widgets/PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';

const TABSFILTER = [
  {
    id: 'arguments',
    label: (
      <span className='flex gap-2'>
        <BadgeCheck />
        Arguments
      </span>
    ),
  },
  {
    id: 'comments',
    label: (
      <span className='flex gap-2'>
        <MessagesSquare />
        Comments
      </span>
    ),
  },
];

export const TabFilters: FC<TTabFilterProps> = ({ authors }) => {
  const options: TDropdownMenuOption<TAuthor>[] = useMemo(
    () => [
      {
        id: 'consensus',
        label: <TabFiltersConsensus />,
        value: { id: 'consensus', name: 'consensus' },
      },
      ...(authors?.map((author) => ({
        id: author.id,
        label: <TabFiltersAuthor author={author} />,
        value: author,
      })) ?? []),
    ],
    [authors]
  );

  const { tabId, userId, setUserId, clearUserId, setTabId } = useArgumentSearchParams('arguments');

  const [selectedOption, setSelectedOption] = useState('consensus');

  useEffect(() => {
    if (!userId) {
      setSelectedOption('consensus');
    } else {
      const option = options.find((o) => o.id == userId);
      if (option) {
        setSelectedOption(option.id.toString());
      }
    }
  }, [userId, options]);

  const onAuthorSelected = (option: TDropdownMenuOption<TAuthor>) => {
    setSelectedOption(option.id.toString());
    if (option.id === 'consensus') {
      clearUserId();
    } else {
      setUserId(option.id);
    }
  };

  const onTabSelected = (id: string | number) => {
    if (id !== tabId) {
      setTabId(id);
    }
  };

  return (
    <nav className='flex gap-4'>
      <DropdownMenu options={options ?? []} value={selectedOption} onChange={onAuthorSelected} />
      <Tabs tabs={TABSFILTER} onTabSelected={onTabSelected} initiallySelected={tabId} />
    </nav>
  );
};
