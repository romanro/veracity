'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { type ReactNode } from 'react';

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
