import type { TNodeType } from './../NewOpinionArgumentsTree.models';
import type { TDropdownMenuOption } from '@libs/ui-components/DropdownMenu/DropdownMenu.models';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import type { THeadingNode, TNode, TTextLeaf } from '../NewOpinionArgumentsTree.models';
import type { EditableNodeProps, TNodeRendererProps } from './NodeRenderer.models';
import { createHeadingNode, createTextLeaf } from '../NewOpinionArgumentsTree.utils';
import type { THeadingNodeProps } from './NodeComponents/NodeComponents.models';

type TNodeToolsParams = {
  node: THeadingNode | TTextLeaf;
  addNode?: TNodeRendererProps['addNode'];
} & EditableNodeProps &
  Pick<THeadingNodeProps, 'updateNode' | 'removeNode'>;

export const useNodeTools = ({
  node,
  editingNode,
  setEditingNode,
  addNode,
  updateNode,
  removeNode,
}: TNodeToolsParams) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { type, title, id, path } = node;
  const inEditState = editingNode === id;

  const level = Number(type.replace('heading', ''));

  const [value, setValue] = useState(title);

  useEffect(() => {
    if (value !== title) setValue(title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useLayoutEffect(() => {
    if (inEditState && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inEditState]);

  const setNodeEditable = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (editingNode === null) {
      if (id !== editingNode) {
        setEditingNode?.(id);
      }
    }
  };

  const onAddNode = useCallback(() => {
    const newNodeLevel = level + 1;
    const newNode = newNodeLevel < 6 ? createHeadingNode(newNodeLevel, '') : createTextLeaf('');
    addNode?.(path, newNode);
    setEditingNode?.(newNode.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNode, setEditingNode, level]);

  const onCancel = useCallback(() => {
    setEditingNode?.(null);
    if (title) {
      setValue(title);
    } else {
      removeNode(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, setEditingNode, title]);

  const onSave = useCallback(() => {
    updateNode(path, (n) => ({ ...n, title: value }));
    setEditingNode?.(null);
  }, [updateNode, setEditingNode, value, path]);

  const onDelete = useCallback(() => {
    setEditingNode?.(null);
    removeNode(path);
  }, [setEditingNode, removeNode, path]);

  const onTypeChanged = useCallback(
    (type: TDropdownMenuOption<TNodeType>) => {
      const { value: newType } = type;
      updateNode(path, (n) => ({ ...n, type: newType, title: value }) as TNode);
    },
    [updateNode, path, value]
  );

  return {
    inEditState,
    setNodeEditable,
    inputRef,
    value,
    setValue,
    onCancel,
    onAddNode,
    onSave,
    onTypeChanged,
    onDelete,
  };
};
