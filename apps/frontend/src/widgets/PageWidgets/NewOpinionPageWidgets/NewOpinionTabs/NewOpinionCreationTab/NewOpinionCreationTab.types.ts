import type { TVersion } from '@core/models/Version.model';
import type { TArgument } from '@core/models/Argument.model';
import type { IDragNodeData } from './NewOpinionDragOverlay';
import type { TTopic } from '@core/models/Topic.model';
import type { TNewOpinionTabsProps } from '../NewOpinionTabs.model';
import type { ReactNode } from 'react';

export interface IAnimationPosition {
  x: number;
  y: number;
}

export type TActiveDrag = { type: 'argument'; data: TArgument } | { type: 'node'; data: IDragNodeData } | null;

export interface INewOpinionCreationState {
  usedArguments: TArgument[];
  activeDrag: TActiveDrag;
  animatingArgument: TArgument | null;
  animationStartPos: IAnimationPosition | null;
  isTreeValid: boolean;
}

export type NewOpinionCreationAction =
  | { type: 'SET_USED_ARGUMENTS'; payload: TArgument[] }
  | { type: 'ADD_USED_ARGUMENT'; payload: TArgument }
  | { type: 'REMOVE_USED_ARGUMENT'; payload: string }
  | { type: 'SET_ACTIVE_DRAG'; payload: TActiveDrag }
  | { type: 'END_DRAG' }
  | { type: 'START_ANIMATION'; payload: { argument: TArgument; position: IAnimationPosition } }
  | { type: 'END_ANIMATION' }
  | { type: 'SET_TREE_VALIDITY'; payload: boolean };

export const initialState: INewOpinionCreationState = {
  usedArguments: [],
  activeDrag: null,
  animatingArgument: null,
  animationStartPos: null,
  isTreeValid: false,
};

export type TNewOpinionCreationTabProps = {
  children: ReactNode;
  topic?: Partial<TTopic>;
  version?: Partial<TVersion>;
  isLoading: boolean;
} & TNewOpinionTabsProps;
