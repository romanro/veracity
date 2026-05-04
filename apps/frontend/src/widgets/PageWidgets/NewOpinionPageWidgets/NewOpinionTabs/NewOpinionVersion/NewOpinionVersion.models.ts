import type { TVersion } from '@/core/models/Version.model';
import type { TNewOpinionTabsProps } from '../NewOpinionTabs.model';
import type { ReactNode } from 'react';

export type TNewOpinionVersionProps = {
  children: ReactNode;
  isLoading: boolean;
  topicTitle?: string;
  version?: Partial<TVersion>;
  onVersionSelected?: (topic: Partial<TVersion>, isValid: boolean) => void;
} & TNewOpinionTabsProps;
