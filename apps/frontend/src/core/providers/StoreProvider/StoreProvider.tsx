'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { type TBaseProviderProps } from '../Providers.models';

export function StoreProvider({ children }: TBaseProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
