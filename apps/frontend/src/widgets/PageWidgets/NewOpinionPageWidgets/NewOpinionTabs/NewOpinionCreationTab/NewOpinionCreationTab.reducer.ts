import type { INewOpinionCreationState, NewOpinionCreationAction } from './NewOpinionCreationTab.types';

export const newOpinionCreationReducer = (
  state: INewOpinionCreationState,
  action: NewOpinionCreationAction
): INewOpinionCreationState => {
  switch (action.type) {
    case 'SET_USED_ARGUMENTS':
      return {
        ...state,
        usedArguments: action.payload,
      };

    case 'ADD_USED_ARGUMENT':
      return {
        ...state,
        usedArguments: [...state.usedArguments, action.payload],
      };

    case 'REMOVE_USED_ARGUMENT':
      return {
        ...state,
        usedArguments: state.usedArguments.filter((arg) => arg.id !== action.payload),
      };

    case 'SET_ACTIVE_DRAG':
      return {
        ...state,
        activeDrag: action.payload,
      };

    case 'END_DRAG':
      return {
        ...state,
        activeDrag: null,
      };

    case 'START_ANIMATION':
      return {
        ...state,
        animatingArgument: action.payload.argument,
        animationStartPos: action.payload.position,
      };

    case 'END_ANIMATION':
      return {
        ...state,
        animatingArgument: null,
        animationStartPos: null,
      };

    case 'SET_TREE_VALIDITY':
      return {
        ...state,
        isTreeValid: action.payload,
      };

    default:
      return state;
  }
};