import { type TTab } from '@/libs/ui-components/Tabs/Tabs.models';
import type { TTopic } from '@core/models/Topic.model';

export type TArgumentTabsProps = {
  items: TTab[];
  activeTab: string;
  className?: string;
};

export type TArgumentTabsGetParams = {
  id: TTab['id'];
  topicId?: TTopic['id'];
  userId?: string | number;
};
