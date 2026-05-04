import { type FC } from 'react';
import styles from './CardArgumentSearch.module.scss';
import classNames from 'classnames';
import { type TCardArgumentSearchProps } from './CardArgumentSearch.models';
import { ArgumentLineButton } from '@/libs/ui-components/Buttons/ArgumentLineButton';
import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { ArgumentSummaryHeader } from '../../ArgumentsList/ArgumentSummary/ArgumentSummaryHeader';
import { ArgumentCardImage } from '../../PageWidgets/ArgumentPageWidgets/ArgumentCardImage';

export const CardArgumentSearch: FC<TCardArgumentSearchProps> = ({
  className,
  item,
  onContextMenu = false,
  showContextMenu,
  newArgument = false,
  onClick,
}) => {
  const { t } = useTranslation('argumentPage');

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
    data: { item },
  });

  return (
    <div className={classNames(styles.cardArgumentSearch, 'flex flex-col gap-4 p-2 pt-4 pb-4', className)}>
      <div className='flex flex-col gap-4' ref={setNodeRef} {...listeners} {...attributes}>
        <ArgumentSummaryHeader author={item?.author} createdDate={item.createdDate} />
        <p className='text-btn-1 pl-[28px] text-justify text-wrap'>{item.text}</p>
        {item.imgUrl && <ArgumentCardImage imagePreview={item.imgUrl} />}
      </div>
      <ArgumentLineButton item={item} onContextMenu={onContextMenu} showContextMenu={showContextMenu ?? (() => {})} />

      {!newArgument && (
        <footer className='pl-6'>
          <RoundedButton
            className='w-full'
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(item, e);
            }}
          >
            {t('botonReuse')}
          </RoundedButton>
        </footer>
      )}
    </div>
  );
};
