import { BadgeCheck, BadgeMinus, MessagesSquare, SaveAll, SearchCheck, TextSearch } from 'lucide-react';
import { type TFunction } from 'i18next';

import { type TTab } from '@/libs/ui-components/Tabs/Tabs.models';
import { type TArgumentTabsGetParams } from './ArgumentTabs.models';

export const getTABS = (t: TFunction): TTab[] => [
  {
    id: 'approve',
    label: (
      <span className='flex gap-2'>
        <BadgeCheck />
        {t('countConfirmations')}
      </span>
    ),
  },
  {
    id: 'refuse',
    label: (
      <span className='flex gap-2'>
        <BadgeMinus />
        {t('countRefutations')}
      </span>
    ),
  },
  {
    id: 'comments',
    label: (
      <span className='flex gap-2'>
        <MessagesSquare />
        {t('countComments')}
      </span>
    ),
  },
];

export const getTABARGUMENTSEARCH = (t: TFunction): TTab[] => [
  {
    id: 'global',
    label: (
      <span className='flex gap-2'>
        <SearchCheck />
        {t('tabsSearchGlobal')}
      </span>
    ),
  },
  {
    id: 'topic',
    label: (
      <span className='flex gap-2'>
        <TextSearch />
        {t('tabsSearchTopic')}
      </span>
    ),
  },
  {
    id: 'saved',
    label: (
      <span className='flex gap-2'>
        <SaveAll />
        {t('tabsSearchSaved')}
      </span>
    ),
  },
];

export const getParamsSearchArgumentsTabs = ({ id, topicId, userId }: TArgumentTabsGetParams) => {
  switch (id) {
    case 'global':
      return {};
    case 'topic':
      return {
        topicId,
      };
    case 'saved':
      if (userId === undefined) {
        return { search: null };
      }
      return { userId };
    default:
      return {};
  }
};
