import { type TFunction } from 'i18next';

import { type TTab } from '@libs/ui-components/Tabs/Tabs.models';

export const getQUERY_LIBRARY_TABS = (t: TFunction): TTab[] => [
  {
    id: 'global',
    label: <>{t('tabsLibrarySuggestions')}</>,
  },
  {
    id: 'topic',
    label: <>{t('tabsLibraryTopic')}</>,
  },
  {
    id: 'saved',
    label: <>{t('tabsLibrarySaved')}</>,
  },
];
