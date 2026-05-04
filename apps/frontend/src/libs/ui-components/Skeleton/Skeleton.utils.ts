import { type ReactNode } from 'react';

type RenderFn = (index: number) => ReactNode;

export function renderComponentMap(count: number, render: RenderFn): ReactNode[] {
  return Array.from({ length: count }, (_, i) => render(i));
}
