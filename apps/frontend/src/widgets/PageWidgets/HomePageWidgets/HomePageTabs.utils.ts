import { type TTab } from '@libs/ui-components/Tabs/Tabs.models';

export const TABSHOME: TTab[] = [
  {
    id: 'news',
    label: 'menuNews',
  },
  {
    id: 'latest',
    label: 'menuLatest',
  },
  {
    id: 'hot',
    label: 'menuHot',
  },
  {
    id: 'mysaved',
    label: 'menuSave',
  },
];

export const getParamsByTabId = (id: TTab['id']) => {
  switch (id) {
    case 'news':
      return {};
    case 'latest':
      return {
        orderBy: 'Create',
        orderDirection: 'Desc',
      };
    case 'hot':
      return {
        orderBy: 'CountArg',
        orderDirection: 'Desc',
      };
    case 'mysaved':
      return {};
    default:
      return {};
  }
};

export const getTabsLayout = (id: TTab['id']) => {
  return ['news'].includes(id.toString()) ? 2 : 1;
};
