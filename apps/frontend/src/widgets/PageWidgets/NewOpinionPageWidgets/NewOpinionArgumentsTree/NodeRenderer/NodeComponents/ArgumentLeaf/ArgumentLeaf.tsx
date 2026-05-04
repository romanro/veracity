import { type FC } from 'react';
import type { TArgumentLeafProps } from '../NodeComponents.models';
import styles from './ArgumentLeaf.module.scss';
import { ArgumentSummaryHeader } from '@widgets/ArgumentsList/ArgumentSummary/ArgumentSummaryHeader';
import classNames from 'classnames';
import { ArgumentSummaryFooter } from '@widgets/ArgumentsList/ArgumentSummary/ArgumentSummaryFooter';
import { CompactRectButton } from '@libs/ui-components/Buttons/Compact/CompactRectButton';
import { Trash2 } from 'lucide-react';
import { ReorderDragHandle } from '../ReorderDragHandle/ReorderDragHandle';
import { useTranslation } from 'react-i18next';
import { ArgumentCardImage } from '@widgets/PageWidgets/ArgumentPageWidgets/ArgumentCardImage';

export const ArgumentLeaf: FC<TArgumentLeafProps> = ({
  node,
  hasParent,
  removeNode,
  onArgumentDeleted,
  isEditing = false,
}) => {
  const { t } = useTranslation('argumentPage');
  const { originalArgumentId } = node;
  const argument = node.originalArgument;

  const author = argument?.author;
  const createdDate = argument?.createdDate ?? '';
  const text = argument?.text ?? argument?.content ?? '';
  const imgUrl = argument?.imgUrl;
  const countComments = argument?.countComments ?? 0;
  const countConfirmations = argument?.countConfirmations ?? 0;
  const countRefutations = argument?.countRefutations ?? 0;

  const onDelete = () => {
    // Remove the node from the tree
    removeNode(node.path);

    // Remove the argument from usedArguments (makes it available in QuoteLibrary again)
    if (onArgumentDeleted && originalArgumentId) {
      onArgumentDeleted(originalArgumentId);
    }
  };

  return (
    <div className={classNames(styles.argumentLeaf, 'node-container')}>
      <ReorderDragHandle node={node} disabled={isEditing} argument={argument} />
      {hasParent && <div className={styles.line} />}
      <ArgumentSummaryHeader author={author} createdDate={createdDate} />
      <div className={classNames('flex flex-col gap-2 py-2 pl-6', styles.summaryText)}>
        <div>
          <p>{text}</p>
        </div>
        {imgUrl && <ArgumentCardImage imagePreview={imgUrl} />}
        <ArgumentSummaryFooter
          countComments={countComments}
          countConfirmations={countConfirmations}
          countRefutations={countRefutations}
        />
      </div>
      <CompactRectButton variant='secondary' className={styles.deleteBtn} onClick={onDelete}>
        <Trash2 size={16} /> {t('delete')}
      </CompactRectButton>
    </div>
  );
};
