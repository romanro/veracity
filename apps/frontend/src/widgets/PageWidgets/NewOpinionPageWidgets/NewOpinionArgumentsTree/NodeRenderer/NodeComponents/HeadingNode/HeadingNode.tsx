import React, { useCallback, type FC, type MouseEvent } from 'react';
import type { THeadingNodeProps } from '../NodeComponents.models';
import { NodeRenderer } from '../../NodeRenderer';
import classNames from 'classnames';
import styles from './HeadingNode.module.scss';
import { NodeEditBar } from '../../../../NewOpinionArgumentsList/NodeEditBar/NodeEditBar';
import { canBeDeleted, getOptionsByType, isTextInNodeValid } from './NodeTypeOption';
import { useNodeTools } from '../../useNodeTools';
import { ReorderDropZone } from '../ReorderDropZone/ReorderDropZone';
import { BaseEditableNode } from '../BaseEditableNode/BaseEditableNode';
import { Plus } from 'lucide-react';

export const HeadingNode: FC<THeadingNodeProps> = ({
  node,
  addNode,
  removeNode,
  updateNode,
  reorderNode,
  editingNode,
  setEditingNode,
  onArgumentDeleted,
  isEditing = false,
}) => {
  const {
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
  } = useNodeTools({
    node,
    editingNode,
    updateNode,
    setEditingNode,
    addNode,
    removeNode,
  });

  const { type, title, children } = node;

  const onAddNodeClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onAddNode?.();
    },
    [onAddNode]
  );

  return (
    <BaseEditableNode
      node={node}
      isEditing={isEditing}
      inEditState={inEditState}
      setNodeEditable={setNodeEditable}
      showDragHandle={type === 'heading1'}
      showLine={true}
      isFirstNode={type === 'heading1'}
      className={styles.headingNode}
      renderToolButton={() => (
        <button className={styles.toolbutton} onClick={onAddNodeClick}>
          <Plus size={18} />
        </button>
      )}
      renderAfter={() => (
        <div className={classNames('flex flex-col', styles.children)}>
          {children.map((child, index) => (
            <React.Fragment key={child.id}>
              {/* Reorder drop zone before each child */}
              <ReorderDropZone parentPath={node.path} insertionIndex={index} isActive={true} isEditing={isEditing} />
              <NodeRenderer
                node={child}
                addNode={addNode}
                removeNode={removeNode}
                updateNode={updateNode}
                reorderNode={reorderNode}
                editingNode={editingNode}
                setEditingNode={setEditingNode}
                onArgumentDeleted={onArgumentDeleted}
                hasParent={true}
              />
            </React.Fragment>
          ))}

          {/* Reorder drop zone after last child */}
          <ReorderDropZone
            parentPath={node.path}
            insertionIndex={children.length}
            isActive={true}
            isEditing={isEditing}
          />
        </div>
      )}
    >
      {inEditState ? (
        <textarea
          ref={inputRef}
          className={classNames(styles[type], styles.heading, styles.textarea)}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder='Enter heading text...'
        />
      ) : (
        <h3 className={classNames(styles[type], styles.heading)}>{title}</h3>
      )}

      {inEditState && (
        <NodeEditBar
          type={type}
          options={getOptionsByType(type)}
          isValid={isTextInNodeValid(value)}
          canBeDeleted={canBeDeleted(children)}
          onTypeChanged={onTypeChanged}
          onCancel={onCancel}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </BaseEditableNode>
  );
};
