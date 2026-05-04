'use client';

import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { type TReactQueryProviderProps } from './ReactQueryProvider.models';
import { getQueryClient } from './ReactQueryProvider.utils';

export function ClientReactQueryProvider({ children, dehydratedState }: TReactQueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
