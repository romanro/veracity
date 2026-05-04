import React, { type FC } from 'react';
import { HeadingNode } from './NodeComponents/HeadingNode/HeadingNode';
import { TextLeaf } from './NodeComponents/TextLeaf/TextLeaf';
import { ArgumentLeaf } from './NodeComponents/ArgumentLeaf/ArgumentLeaf';
import type { TNodeRendererProps } from './NodeRenderer.models';
import { InsertionDropZone } from './NodeComponents/InsertionDropZone';
import { NodeWithInsertionZones } from './NodeComponents/NodeWithInsertionZones';
import { ReorderDropZone } from './NodeComponents/ReorderDropZone/ReorderDropZone';

export const NodeRenderer: FC<TNodeRendererProps> = ({
  node,
  hasParent = false,
  addNode,
  removeNode,
  updateNode,
  reorderNode,
  onArgumentDeleted,
  isDraggingArgument = false,
  isDraggingNode = false,
  ...editableNodeProps
}) => {
  const { type, id } = node;
  const { editingNode } = editableNodeProps;
  const isEditing = !!editingNode;

  // Root node dropzone is disabled - no drops allowed on root

  // Helper function to wrap non-root nodes with insertion zones
  const wrapWithInsertionZones = (content: React.ReactNode) => {
    // Don't wrap root node with insertion zones
    if (hasParent === false) {
      return content;
    }
    return (
      <NodeWithInsertionZones node={node} isEditing={isEditing}>
        {content}
      </NodeWithInsertionZones>
    );
  };

  switch (type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      return wrapWithInsertionZones(
        <HeadingNode
          key={id}
          node={node}
          addNode={addNode}
          removeNode={removeNode}
          updateNode={updateNode}
          reorderNode={reorderNode}
          onArgumentDeleted={onArgumentDeleted}
          isDraggingNode={isDraggingNode}
          isEditing={isEditing}
          {...editableNodeProps}
        />
      );

    case 'text':
      return wrapWithInsertionZones(
        <TextLeaf
          key={id}
          node={node}
          hasParent={hasParent}
          removeNode={removeNode}
          updateNode={updateNode}
          reorderNode={reorderNode}
          isEditing={isEditing}
          {...editableNodeProps}
        />
      );

    case 'argument':
      return wrapWithInsertionZones(
        <ArgumentLeaf
          key={id}
          node={node}
          hasParent={hasParent}
          removeNode={removeNode}
          updateNode={updateNode}
          reorderNode={reorderNode}
          onArgumentDeleted={onArgumentDeleted}
          isEditing={isEditing}
        />
      );

    case 'root':
      return (
        <div className='min-h-[1px]'>
          {/* Insertion zone before first child */}

          <InsertionDropZone
            parentPath={node.path}
            insertionIndex={0}
            siblingPath={node.children?.[0]?.path || ''}
            insertBefore={true}
            hasParent={false}
            isEditing={isEditing}
          />

          {node.children.map((child, index) => (
            <React.Fragment key={child.id}>
              {/* Reorder drop zone before each child */}
              <ReorderDropZone parentPath={node.path} insertionIndex={index} isActive={true} isEditing={isEditing} />
              <NodeRenderer
                node={child}
                addNode={addNode}
                removeNode={removeNode}
                updateNode={updateNode}
                reorderNode={reorderNode}
                hasParent={false}
                onArgumentDeleted={onArgumentDeleted}
                isDraggingArgument={isDraggingArgument}
                isDraggingNode={isDraggingNode}
                {...editableNodeProps}
              />
            </React.Fragment>
          ))}

          {/* Reorder drop zone after last child */}
          <ReorderDropZone
            parentPath={node.path}
            insertionIndex={node.children.length}
            isActive={true}
            isEditing={isEditing}
          />

          {/* Insertion zone after last child */}
          {node.children.length > 0 && (
            <InsertionDropZone
              parentPath={node.path}
              insertionIndex={node.children.length}
              siblingPath={node.children[node.children.length - 1].path}
              insertBefore={false}
              hasParent={false}
              isEditing={isEditing}
            />
          )}
        </div>
      );

    default:
      return null;
  }
};
