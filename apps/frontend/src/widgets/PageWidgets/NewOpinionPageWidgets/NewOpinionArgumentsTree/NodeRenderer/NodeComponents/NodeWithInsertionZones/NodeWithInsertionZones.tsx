import { type FC, type ReactNode } from 'react';
import { InsertionDropZone } from '../InsertionDropZone';
import type { TNode } from '../../../NewOpinionArgumentsTree.models';
import { getParentPath, getNodeIndex } from '../../../NewOpinionArgumentsTree.utils';

interface TNodeWithInsertionZonesProps {
  node: TNode;
  children: ReactNode;
  isEditing?: boolean;
}

export const NodeWithInsertionZones: FC<TNodeWithInsertionZonesProps> = ({ node, children, isEditing = false }) => {
  const { path, type } = node;
  // Extract parent path and node index from the node's path
  const parentPath = getParentPath(path);
  const nodeIndex = getNodeIndex(path);

  return (
    <>
      {/* Insertion zone before this node */}
      {type !== 'heading1' && (
        <InsertionDropZone
          parentPath={parentPath}
          insertionIndex={nodeIndex}
          siblingPath={path}
          insertBefore={true}
          hasParent={!['heading1', 'root'].includes(type)} // No parent for root and heading1
          isEditing={isEditing}
        />
      )}

      {/* The actual node */}
      {children}

      {/* Insertion zone after this node */}
      <InsertionDropZone
        parentPath={parentPath}
        insertionIndex={nodeIndex + 1}
        siblingPath={path}
        insertBefore={false}
        isEditing={isEditing}
      />
    </>
  );
};
