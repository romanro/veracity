import { type TMainParamsProps } from '@core/models/main';
import { type DehydratedState } from '@tanstack/react-query';
import type {
  TOpinionCreationStep,
  TStepId,
  TStepState,
} from '../NewOpinionWizardStepper/NewOpinionWizardStepper.models';
import type { TTopic } from '@/core/models/Topic.model';
import type { TVersion } from '@/core/models/Version.model';

export type TNewOpinionPageContainerProps = {
  dehydratedState: DehydratedState;
  mainParams: TMainParamsProps;
};

export type TState = {
  steps: TOpinionCreationStep[];
  topic?: Partial<TTopic>;
  version?: Partial<TVersion>;
  activeStepId: TStepId;
  showConfirmationModal: boolean;
};

export type TAction =
  | { type: 'SET_ACTIVE'; payload: TStepId }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP_STATE'; payload: { id: TStepId; state: TStepState } }
  | {
      type: 'UPDATE_STEP_INFO';
      payload: { id: TStepId; step: Partial<Pick<TOpinionCreationStep, 'description' | 'title'>> };
    }
  | { type: 'SET_TOPIC'; payload: { topic: Partial<TTopic> | undefined } }
  | { type: 'SET_VERSION'; payload: { version: Partial<TVersion> | undefined } }
  | { type: 'SET_STEP_IS_DIRTY'; payload: { id: TStepId; isDirty: boolean } }
  | { type: 'SET_CONFIRMATION_MODAL'; payload: boolean };
