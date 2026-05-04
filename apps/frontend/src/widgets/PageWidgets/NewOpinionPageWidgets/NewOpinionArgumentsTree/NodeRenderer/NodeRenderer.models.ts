import type { TNode } from '../NewOpinionArgumentsTree.models';

export type TNodeRendererProps = {
  node: TNode;
  addNode: (parentPath: string, newNode: TNode, index?: number) => void;
  removeNode: (path: string) => void;
  reorderNode: (fromPath: string, toParentPath: string, toIndex: number) => void;
  hasParent?: boolean;
  onArgumentDeleted?: (argumentId: string) => void;
  isDraggingArgument?: boolean;
  isDraggingNode?: boolean;
} & EditableNodeProps;

export type EditableNodeProps = {
  editingNode?: string | null;
  setEditingNode?: (id: string | null) => void;
  updateNode: (path: string, updater: (node: TNode) => TNode) => void;
};
