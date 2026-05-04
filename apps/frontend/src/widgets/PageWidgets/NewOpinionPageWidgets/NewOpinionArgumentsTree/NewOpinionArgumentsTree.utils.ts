import type { TArgumentLeaf, TDocumentRoot, THeadingNode, TNode, TTextLeaf } from './NewOpinionArgumentsTree.models';

/**
 * Recalculating path
 * @param node TNode tree
 * @param basePath Path of parent (ex "0.10")
 * @param index Index of node in parent
 */
function assignPaths<T extends TNode>(node: T, basePath: string, index: number): T {
  const newPath = basePath ? `${basePath}.${index}` : `${index}`;
  const updated: any = { ...node, path: newPath };

  if ('children' in node && Array.isArray(node.children)) {
    updated.children = node.children.map((child, i) => assignPaths(child, newPath, i));
  }

  return updated;
}

/**
 * Recalculating paths for all tree
 */
export function recalculatePaths(root: TDocumentRoot): TDocumentRoot {
  return assignPaths(root, '', 0);
}

/**
 * Finds node by path (ex "0.0.1")
 */
export function findNodeByPath(root: TNode, path: string): TNode | null {
  if (path === root.path) return root;

  const segments = path.split('.').map(Number);
  let current: TNode = root;

  for (let i = 1; i < segments.length; i++) {
    if (!('children' in current)) return null;
    const child = current.children?.[segments[i]];
    if (!child) return null;
    current = child;
  }
  return current;
}

/**
 * Updates TNode by path
 * @param root root node
 * @param path ex "0.0.1"
 * @param updater function, updates  (node: TNode) => TNode
 */
export function updateNodeByPath<T extends TNode>(root: T, path: string, updater: (node: TNode) => TNode): T {
  if (root.path === path) {
    return updater(root) as T;
  }

  const segments = path.split('.').map(Number);

  function helper<N extends TNode & { children?: any[] }>(node: N, depth: number): N {
    if (!node.children) return node;

    const index = segments[depth + 1];
    if (index == null) return node;

    return {
      ...node,
      children: node.children.map((child, i) =>
        i === index ? (child.path === path ? (updater(child) as typeof child) : helper(child, depth + 1)) : child
      ) as typeof node.children,
    };
  }

  return helper(root, 0) as T;
}

/**
 * Inserts new node into children by path
 * @param root
 * @param parentPath
 * @param newNode
 * @param index
 */
export function insertNodeAtPath<T extends TNode>(root: T, parentPath: string, newNode: TNode, index?: number): T {
  function helper<N extends TNode & { children?: any[] }>(node: N): N {
    if (node.path === parentPath && node.children) {
      const children = [...node.children];
      const insertAt = index != null ? index : children.length;
      children.splice(insertAt, 0, newNode);
      return { ...node, children } as N;
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map((child) => helper(child)) as typeof node.children,
      } as N;
    }

    return node;
  }

  return helper(root) as T;
}

/**
 * Deletes Node by path
 * @param root tree
 * @param path
 */
export function removeNodeAtPath<T extends TNode>(root: T, path: string): T {
  function helper<N extends TNode & { children?: TNode[] }>(node: N): N {
    if (!node.children) return node;

    return {
      ...node,
      children: node.children
        .filter((child) => child.path !== path)
        .map((child) => helper(child)) as typeof node.children,
    };
  }

  return helper(root) as T;
}

const generateNodeId = () => crypto.randomUUID();

export function createNode<T extends Omit<TNode, 'id'>>(node: T): T & { id: string } {
  return { ...node, id: generateNodeId() };
}

export function createHeadingNode(level: number, title: string): THeadingNode {
  return {
    id: generateNodeId(),
    type: `heading${level}` as THeadingNode['type'],
    title,
    path: '',
    children: [],
  };
}

export function createTextLeaf(title: string, path: string = ''): TTextLeaf {
  return {
    id: generateNodeId(),
    type: 'text',
    title,
    path,
  };
}

export function createArgumentLeaf(argId: string, path: string): TArgumentLeaf {
  return {
    id: generateNodeId(),
    type: 'argument',
    originalArgumentId: argId,
    path,
  };
}

/**
 * Inserts a node as a sibling by calculating the parent path and insertion index
 * @param root
 * @param siblingPath - path of the sibling node to insert after/before
 * @param newNode
 * @param insertBefore - if true, inserts before the sibling, otherwise after
 */
export function insertNodeAsSibling<T extends TNode>(root: T, siblingPath: string, newNode: TNode, insertBefore: boolean = false): T {
  // Extract parent path and sibling index from the sibling path
  const pathSegments = siblingPath.split('.').map(Number);
  if (pathSegments.length < 2) {
    // If sibling is at root level, insert into root children
    const siblingIndex = pathSegments[0];
    const insertIndex = insertBefore ? siblingIndex : siblingIndex + 1;
    return insertNodeAtPath(root, 'root', newNode, insertIndex);
  }

  // Get parent path (all segments except the last one)
  const parentPathSegments = pathSegments.slice(0, -1);
  const parentPath = parentPathSegments.join('.');

  // Get sibling index (last segment)
  const siblingIndex = pathSegments[pathSegments.length - 1];
  const insertIndex = insertBefore ? siblingIndex : siblingIndex + 1;

  return insertNodeAtPath(root, parentPath, newNode, insertIndex);
}

/**
 * Extracts parent path from a node path
 * @param nodePath - e.g., "0.1.2"
 * @returns parent path - e.g., "0.1"
 */
export function getParentPath(nodePath: string): string {
  const segments = nodePath.split('.');
  if (segments.length <= 1) {
    return 'root'; // Node is at root level, parent is root
  }
  return segments.slice(0, -1).join('.');
}

/**
 * Extracts the index of a node within its parent from the node path
 * @param nodePath - e.g., "0.1.2"
 * @returns index - e.g., 2
 */
export function getNodeIndex(nodePath: string): number {
  const segments = nodePath.split('.');
  return parseInt(segments[segments.length - 1], 10);
}

/**
 * Reorders a node from one position to another
 * @param root - the root node
 * @param fromPath - path of the node to move
 * @param toParentPath - path of the destination parent
 * @param toIndex - index within the destination parent
 */
export function reorderNode<T extends TNode>(root: T, fromPath: string, toParentPath: string, toIndex: number): T {
  // First, extract the node to move
  const nodeToMove = findNodeByPath(root, fromPath);
  if (!nodeToMove) {
    return root; // Node not found, return unchanged
  }

  // Remove the node from its current location
  const withNodeRemoved = removeNodeAtPath(root, fromPath);

  // Insert the node at the new location
  const withNodeInserted = insertNodeAtPath(withNodeRemoved, toParentPath, nodeToMove, toIndex);

  return withNodeInserted;
}

/**
 * Validates the entire tree structure
 * Returns false if:
 * - Tree is empty (no children in root)
 * - Any text leaf has empty title
 * - Any heading node has empty title
 * - Argument leafs are always considered valid
 */
export function validateTree(root: TDocumentRoot): boolean {
  // Check if tree is empty
  if (!root.children || root.children.length === 0) {
    return false;
  }

  // Recursively validate all nodes
  return validateNode(root);
}

/**
 * Validates a single node and its children
 */
function validateNode(node: TNode): boolean {
  // Check current node validity
  if (!isNodeValid(node)) {
    return false;
  }

  // Recursively check children if they exist
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.every(child => validateNode(child));
  }

  return true;
}

/**
 * Validates a single node (without checking children)
 */
function isNodeValid(node: TNode): boolean {
  switch (node.type) {
    case 'root':
      // Root is valid if it has children (checked in validateTree)
      return true;

    case 'text':
      // Text leaf is valid if title is not empty
      return !!(node as TTextLeaf).title?.trim();

    case 'argument':
      // Argument leaf is always valid (references external argument)
      return true;

    case 'heading1':
    case 'heading2':
    case 'heading3':
      // Heading is valid if title is not empty
      return !!(node as THeadingNode).title?.trim();

    default:
      // Unknown node type, consider invalid
      return false;
  }
}

/**
 * Opinion strength metrics based on argument reuse
 */
export interface IOpinionStrength {
  reusedCount: number;
  newTextCount: number;
  totalCount: number;
  strengthPercentage: number;
}

/**
 * Calculate opinion strength based on reused vs new arguments
 * Stronger opinion = more reused arguments from existing sources
 * Weaker opinion = more new text arguments and heading nodes
 */
export function calculateOpinionStrength(root: TDocumentRoot): IOpinionStrength {
  let reusedCount = 0;
  let otherNodesCount = 0;

  function countNodes(node: TNode): void {
    // Skip root node itself
    if (node.type === 'root') {
      if ('children' in node && Array.isArray(node.children)) {
        node.children.forEach(child => countNodes(child));
      }
      return;
    }

    // Count argument nodes as reused
    if (node.type === 'argument') {
      reusedCount++;
    } else {
      // Count all other node types (text, heading1, heading2, etc.)
      otherNodesCount++;
    }

    // Recursively process children for heading nodes
    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(child => countNodes(child));
    }
  }

  // Start counting from root
  countNodes(root);

  const totalCount = reusedCount + otherNodesCount;
  const strengthPercentage = totalCount > 0 ? Math.round((reusedCount / totalCount) * 100) : 0;

  return {
    reusedCount,
    newTextCount: otherNodesCount,
    totalCount,
    strengthPercentage,
  };
}
