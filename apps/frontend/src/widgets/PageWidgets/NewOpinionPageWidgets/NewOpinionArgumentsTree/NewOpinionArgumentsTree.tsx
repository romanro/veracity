import { AddNodeButton } from './AddNodeButton/AddNodeButton';
import { useTree } from './NewOpinionArgumentsTree.reducer';
import { initialRoot } from './NewOpinionArgumentsTree.mock';
import { NodeRenderer } from './NodeRenderer/NodeRenderer';
import { createHeadingNode } from './NewOpinionArgumentsTree.utils';
import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import type { TNode, TDocumentRoot } from './NewOpinionArgumentsTree.models';

type TNewOpinionArgumentsTreeProps = {
  onArgumentDeleted?: (argumentId: string) => void;
  isDraggingArgument?: boolean;
  isDraggingNode?: boolean;
  onValidityChange?: (isValid: boolean) => void;
  initialTree?: TDocumentRoot;
  onTreeChange?: (tree: TDocumentRoot) => void;
};

export type TNewOpinionArgumentsTreeRef = {
  addNode: (parentPath: string, newNode: TNode, index?: number) => void;
  addSibling: (siblingPath: string, newNode: TNode, insertBefore?: boolean) => void;
  reorderNode: (fromPath: string, toParentPath: string, toIndex: number) => void;
  getEditingNode: () => string | null;
  getTreeValidity: () => boolean;
  getTreeState: () => TDocumentRoot;
  setTreeState: (tree: TDocumentRoot) => void;
};

export const NewOpinionArgumentsTree = forwardRef<TNewOpinionArgumentsTreeRef, TNewOpinionArgumentsTreeProps>(
  (
    {
      onArgumentDeleted,
      isDraggingArgument = false,
      isDraggingNode = false,
      onValidityChange,
      initialTree,
      onTreeChange,
    },
    ref
  ) => {
    const { tree, isValid, addNode, addSibling, removeNode, updateNode, reorderNode, setTree } = useTree(
      initialTree || initialRoot
    );
    const [editingNode, setEditingNode] = useState<string | null>(null);

    // Notify parent when validity changes
    useEffect(() => {
      onValidityChange?.(isValid);
    }, [isValid, onValidityChange]);

    // Notify parent when tree changes
    useEffect(() => {
      onTreeChange?.(tree);
    }, [tree, onTreeChange]);

    useImperativeHandle(ref, () => ({
      addNode,
      addSibling,
      reorderNode,
      getEditingNode: () => editingNode,
      getTreeValidity: () => isValid,
      getTreeState: () => tree,
      setTreeState: (newTree: TDocumentRoot) => setTree(newTree),
    }));

    const addRootNode = () => {
      const newNode = createHeadingNode(1, '');
      addNode('0', newNode);
      setEditingNode(newNode.id);
    };

    return (
      <>
        <NodeRenderer
          node={tree}
          hasParent={false}
          addNode={addNode}
          removeNode={removeNode}
          updateNode={updateNode}
          reorderNode={reorderNode}
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          onArgumentDeleted={onArgumentDeleted}
          isDraggingArgument={isDraggingArgument}
          isDraggingNode={isDraggingNode}
        />
        <AddNodeButton onClick={addRootNode} disabled={!!editingNode} />
      </>
    );
  }
);

NewOpinionArgumentsTree.displayName = 'NewOpinionArgumentsTree';
