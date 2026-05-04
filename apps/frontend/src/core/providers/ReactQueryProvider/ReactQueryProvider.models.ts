import { type DehydratedState } from '@tanstack/react-query';
import { type TBaseProviderProps } from '../Providers.models';

export type TReactQueryProviderProps = {
  dehydratedState?: DehydratedState | null;
} & TBaseProviderProps;
