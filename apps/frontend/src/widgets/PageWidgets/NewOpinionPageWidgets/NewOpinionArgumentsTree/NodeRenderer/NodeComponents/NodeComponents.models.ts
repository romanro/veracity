import type { TArgumentLeaf, THeadingNode, TTextLeaf } from '../../NewOpinionArgumentsTree.models';
import type { EditableNodeProps, TNodeRendererProps } from '../NodeRenderer.models';

export type THeadingNodeProps = {
  node: THeadingNode;
  addNode: TNodeRendererProps['addNode'];
  removeNode: TNodeRendererProps['removeNode'];
  reorderNode: TNodeRendererProps['reorderNode'];
  onArgumentDeleted?: TNodeRendererProps['onArgumentDeleted'];
  isDraggingNode?: boolean;
  isEditing?: boolean;
} & EditableNodeProps;

export type TTextLeafProps = {
  node: TTextLeaf;
  hasParent?: boolean;
  removeNode: TNodeRendererProps['removeNode'];
  reorderNode: TNodeRendererProps['reorderNode'];
  isEditing?: boolean;
} & EditableNodeProps;

export type TArgumentLeafProps = {
  node: TArgumentLeaf;
  hasParent?: boolean;
  removeNode: TNodeRendererProps['removeNode'];
  updateNode: TNodeRendererProps['updateNode'];
  reorderNode: TNodeRendererProps['reorderNode'];
  onArgumentDeleted?: (argumentId: string) => void;
  isEditing?: boolean;
};
