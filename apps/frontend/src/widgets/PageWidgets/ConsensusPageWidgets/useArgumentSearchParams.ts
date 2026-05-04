'use client';
import { useQueryParams } from '@libs/hooks/useQueryParams';

export const useArgumentSearchParams = (initiallySelectedTab?: string) => {
  const { getParam, setParam, clearParam } = useQueryParams();

  const userId = getParam('userId') ?? undefined;
  const tabId = getParam('tabId') ?? initiallySelectedTab;

  const setUserId = (id: string | number) => {
    setParam('userId', id.toString());
  };

  const clearUserId = () => {
    clearParam('userId');
  };

  const setTabId = (id: string | number) => {
    setParam('tabId', id.toString());
  };

  return { userId, tabId, setUserId, setTabId, clearUserId };
};
