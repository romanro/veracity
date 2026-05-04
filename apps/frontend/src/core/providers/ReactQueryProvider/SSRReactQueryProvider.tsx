import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { type TReactQueryProviderProps } from './ReactQueryProvider.models';
import { getQueryClient } from './ReactQueryProvider.utils';

export function SSRReactQueryProvider({ children, dehydratedState }: TReactQueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
