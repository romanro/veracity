import { type TTopic } from '@/core/models/Topic.model';
import { type TNewOpinionTabsProps } from '../NewOpinionTabs.model';
import type { ReactNode } from 'react';

export type TNewOpinionTopicProps = {
  children: ReactNode;
  isLoading: boolean;
  topic?: Partial<TTopic>;
  onTopicSelected?: (topic: Partial<TTopic>, isValid: boolean) => void;
} & TNewOpinionTabsProps;
