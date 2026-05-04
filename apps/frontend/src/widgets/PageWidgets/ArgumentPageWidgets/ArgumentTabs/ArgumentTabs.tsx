import { useCallback, type FC } from 'react';

import { Card } from '@libs/ui-components/Card';
import { Tabs } from '@libs/ui-components/Tabs';
import { useArgumentSearchParams } from '../../ConsensusPageWidgets/useArgumentSearchParams';
import { type TArgumentTabsProps } from './ArgumentTabs.models';

export const ArgumentTabs: FC<TArgumentTabsProps> = ({ items, activeTab, className }) => {
  const { tabId, setTabId } = useArgumentSearchParams(activeTab);

  const onTabSelected = useCallback(
    (id: string | number) => {
      if (tabId !== id) {
        setTabId(id);
      }
    },
    [setTabId, tabId]
  );

  return (
    <Card className={className}>
      <Tabs tabs={items} initiallySelected={tabId} onTabSelected={onTabSelected} />
    </Card>
  );
};
