import { type ArgumentsState } from '@/store/argumentsSlice';
import { useSelector } from 'react-redux';

export const useListArguments = () => {
  return useSelector((state: { arguments: ArgumentsState }) => state.arguments.items);
};
