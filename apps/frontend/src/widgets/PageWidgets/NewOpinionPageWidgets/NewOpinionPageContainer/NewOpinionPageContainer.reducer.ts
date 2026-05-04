import { type TOpinionCreationStep } from '../NewOpinionWizardStepper/NewOpinionWizardStepper.models';
import type { TAction, TState } from './NewOpinionPageContainer.models';

const INITIAL_TOPIC = {
  created: 'steps.0.created',
  title: 'steps.0.title',
  description: 'steps.0.description',
};

const INITIAL_VERSION = {
  created: 'steps.1.created',
  title: 'steps.1.title',
  description: 'steps.1.description',
};

const initialSteps: TOpinionCreationStep[] = [
  {
    id: 'TOPIC',
    number: 1,
    title: INITIAL_TOPIC.title,
    description: INITIAL_TOPIC.description,
    state: 'pending',
    isDirty: false,
  },
  {
    id: 'VERSION',
    number: 2,
    title: INITIAL_VERSION.title,
    description: INITIAL_VERSION.description,
    state: 'pending',
    isDirty: false,
  },
  {
    id: 'OPINION',
    number: 3,
    title: 'steps.2.title',
    description: 'steps.2.description',
    state: 'pending',
    isDirty: false,
  },
];

export const initialState: TState = {
  steps: initialSteps,
  showConfirmationModal: false,
  activeStepId: 'TOPIC',
};

export function reducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case 'SET_ACTIVE':
      return {
        ...state,
        activeStepId: action.payload,
      };

    case 'SET_STEP_STATE': {
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.id ? { ...step, state: action.payload.state } : step
        ),
      };
    }

    case 'UPDATE_STEP_INFO': {
      return {
        ...state,
        steps: state.steps.map((step) => (step.id === action.payload.id ? { ...step, ...action.payload.step } : step)),
      };
    }

    case 'SET_TOPIC': {
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === 'TOPIC'
            ? {
                ...step,
                title: action.payload.topic?.title ? INITIAL_TOPIC.created : INITIAL_TOPIC.title,
                description: action.payload.topic?.title ?? INITIAL_TOPIC.description,
                state: action.payload.topic?.title ? 'completed' : 'pending',
              }
            : step
        ),
        topic: action.payload.topic,
        activeStepId: action.payload.topic?.title ? 'VERSION' : 'TOPIC',
      };
    }

    case 'SET_VERSION': {
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === 'VERSION'
            ? {
                ...step,
                title: action.payload.version?.title ? INITIAL_VERSION.created : INITIAL_VERSION.title,
                description: action.payload.version?.title ?? INITIAL_VERSION.description,
                state: action.payload.version?.title ? 'completed' : 'pending',
              }
            : step
        ),
        version: action.payload.version,
        activeStepId: action.payload.version?.title ? 'OPINION' : 'VERSION',
      };
    }

    case 'SET_STEP_IS_DIRTY': {
      return {
        ...state,
        steps: state.steps.map((step) =>
          step.id === action.payload.id ? { ...step, isDirty: action.payload.isDirty } : step
        ),
      };
    }

    case 'SET_CONFIRMATION_MODAL':
      return {
        ...state,
        showConfirmationModal: action.payload,
      };

    default:
      return state;
  }
}
