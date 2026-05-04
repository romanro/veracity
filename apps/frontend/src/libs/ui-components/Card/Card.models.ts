import { type DraggableAttributes } from '@dnd-kit/core';
import { type ReactNode } from 'react';

// Inlined to avoid the deep `@dnd-kit/core/dist/hooks/utilities` type-only path,
// which Turbopack rejects because there's no runtime module at that path.
type SyntheticListenerMap = Record<string, Function>;

export type CardProps = {
  children: ReactNode;
  className?: string;
  setNodeRef?: (element: HTMLElement | null) => void;
  attributesDrag?: DraggableAttributes;
  listenersDrag?: SyntheticListenerMap | undefined;
};
