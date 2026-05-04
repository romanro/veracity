import { type MutableRefObject } from 'react';
import { type TArgument } from '@core/models/Argument.model';
import { type TTopic } from '@core/models/Topic.model';
import { type TVersion } from '@core/models/Version.model';
import { type TNewOpinionArgumentsListRef } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList';

export type TConfRefHeaderProps = {
  argument?: TArgument;
  topic?: Partial<TTopic>;
  version?: Partial<TVersion>;
  type: string;
  isTreeValid: boolean;
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  argumentId: string;
  topicId: string;
  versionId: string;
  onCancel: () => void;
};

export type TConfRefArgumentSummaryProps = {
  argument?: TArgument;
  topic?: Partial<TTopic>;
  version?: Partial<TVersion>;
};

export type TConfRefActionsProps = {
  isApprove: boolean;
  isTreeValid: boolean;
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  argumentId: string;
  topicId: string;
  versionId: string;
  onCancel: () => void;
};
