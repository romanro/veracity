import { DragOverlay } from '@dnd-kit/core';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CardArgumentSearch } from '@/widgets/Arguments/CardArgumentSearch';
import type { TArgument } from '@core/models/Argument.model';
import type { TNode } from '../../../NewOpinionArgumentsTree/NewOpinionArgumentsTree.models';
import { GripVertical, FileText, Heading1, Heading2, Heading3, MessageSquare } from 'lucide-react';
import type { TActiveDrag } from '../NewOpinionCreationTab.types';
import styles from './NewOpinionDragOverlay.module.scss';
import { Card } from '@libs/ui-components/Card';

export interface IDragNodeData {
  nodeType: string;
  nodePath: string;
  node: TNode;
  argument?: TArgument;
  type: 'node-reorder';
}

export interface INewOpinionDragOverlayProps {
  activeDrag: TActiveDrag;
}

export const NewOpinionDragOverlay: FC<INewOpinionDragOverlayProps> = ({ activeDrag }) => {
  const { t } = useTranslation('newOpinionPage');

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'heading1':
        return <Heading1 size={16} />;
      case 'heading2':
        return <Heading2 size={16} />;
      case 'heading3':
        return <Heading3 size={16} />;
      case 'text':
        return <FileText size={16} />;
      case 'argument':
        return <MessageSquare size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getNodePreviewContent = (node: TNode) => {
    if ('title' in node && node.title) {
      return node.title;
    }
    if (node.type === 'argument') {
      return t('argumentNode');
    }
    return t('textNode');
  };

  const dragPreview = useMemo(() => {
    if (!activeDrag) return null;

    // Extract argument data from either source
    let argument: TArgument | null = null;
    let node: TNode | null = null;
    let nodeType: string | null = null;

    if (activeDrag.type === 'argument') {
      argument = activeDrag.data;
    } else if (activeDrag.type === 'node') {
      const dragNodeData = activeDrag.data;
      node = dragNodeData.node;
      nodeType = dragNodeData.nodeType;
      argument = dragNodeData.argument || null;
    }

    // If we have argument data, render rich argument preview
    if (argument) {
      return (
        <div
          className={styles.argumentPreview}
          role='img'
          aria-label={t('draggingArgument', { title: argument.title || 'argument' })}
        >
          <CardArgumentSearch item={argument} newArgument={true} onContextMenu={false} />
        </div>
      );
    }

    // Otherwise, render simple node preview
    if (node && nodeType) {
      const icon = getNodeIcon(nodeType);
      const content = getNodePreviewContent(node);

      return (
        <Card className={styles.nodePreview} aria-label={t('movingNode', { nodeType })}>
          <div className='flex items-center gap-2'>
            <div className={styles.nodeIconContainer}>
              <GripVertical size={12} className={styles.nodeGripIcon} />
              {icon}
            </div>
            <div className={styles.nodeContent}>
              <div className={styles.nodeTitle}>{content}</div>
            </div>
          </div>
        </Card>
      );
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDrag, t]);

  return <DragOverlay>{dragPreview}</DragOverlay>;
};
