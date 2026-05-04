import { useCallback, useMemo, type FC, type MouseEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TArgumentItemProps } from './ArgumentItem.models';
import { ArgumentSummaryHeader } from '../../../../ArgumentsList/ArgumentSummary/ArgumentSummaryHeader';
import { ArgumentCardImage } from '../../../ArgumentPageWidgets/ArgumentCardImage';
import { ArgumentSummaryFooter } from '../../../../ArgumentsList/ArgumentSummary/ArgumentSummaryFooter';
import { CompactRectButton } from '@libs/ui-components/Buttons/Compact/CompactRectButton';
import { ReorderDragHandle } from '../ReorderDragHandle/ReorderDragHandle';
import classNames from 'classnames';
import { AddItemAfterButton } from '../AddItemAfterButton';
import { createHeadingItem } from '../NewOpinionArgumentsList.utils';

export const ArgumentItem: FC<TArgumentItemProps> = ({
  item,
  removeItem,
  isAnyItemEditing,
  onArgumentDeleted,
  isFirstItem,
  addItemAfter,
  setEditingItemId,
  showLine = true,
}) => {
  const { t } = useTranslation('argumentPage');
  const { originalArgumentId } = item;
  const argument = item.metaData?.originalArgument;

  // Handle deleting argument item
  const onDelete = useCallback(() => {
    if (originalArgumentId) {
      onArgumentDeleted?.(originalArgumentId);
    }
    removeItem(item.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, removeItem, onArgumentDeleted]);

  // Handle adding new item after this one
  const onAddItemClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (isAnyItemEditing) return;

      const newItem = createHeadingItem(1, '');
      addItemAfter(newItem);
      setTimeout(() => setEditingItemId(newItem.id), 0);
    },
    [isAnyItemEditing, addItemAfter, setEditingItemId]
  );

  const { author, createdDate, bodyText, imgUrl, countComments, countConfirmations, countRefutations } = useMemo(
    () => ({
      author: argument?.author ?? item.metaData?.author,
      createdDate: argument?.createdDate ?? item.metaData?.createdDate?.toDateString?.() ?? '',
      bodyText: argument?.text ?? argument?.content ?? '',
      imgUrl: argument?.imgUrl,
      countComments: argument?.countComments ?? 0,
      countConfirmations: argument?.countConfirmations ?? 0,
      countRefutations: argument?.countRefutations ?? 0,
    }),
    [argument, item.metaData]
  );

  return (
    <div className='group/arg flex flex-col rounded-lg px-[5px] py-[10px] gap-[10px] relative bg-transparent hover:bg-[var(--color-gray-warm-50)]'>
      {showLine && (
        <div
          className={classNames(
            'h-full w-px bg-[var(--color-gray-warm-200)] absolute z-[1] top-0 left-[13px]',
            isFirstItem && 'top-[14px] h-[calc(100%-14px)]'
          )}
        />
      )}
      <ArgumentSummaryHeader author={author} createdDate={createdDate} />
      <div className='flex flex-col gap-4 py-2 pl-[30px]'>
        <p>{bodyText}</p>
        {imgUrl && <ArgumentCardImage imagePreview={imgUrl} />}
        <ArgumentSummaryFooter
          countComments={countComments}
          countConfirmations={countConfirmations}
          countRefutations={countRefutations}
        />
      </div>
      <CompactRectButton
        variant='secondary'
        className='absolute flex items-center gap-[5px] bottom-[10px] right-[5px] opacity-0 transition-opacity duration-200 group-hover/arg:opacity-100'
        onClick={onDelete}
      >
        <Trash2 size={16} /> {t('delete')}
      </CompactRectButton>
      <ReorderDragHandle item={item} disabled={isAnyItemEditing} />
      <AddItemAfterButton
        onClick={onAddItemClick}
        disabled={isAnyItemEditing}
        className='group-hover/arg:opacity-100'
      />
    </div>
  );
};
