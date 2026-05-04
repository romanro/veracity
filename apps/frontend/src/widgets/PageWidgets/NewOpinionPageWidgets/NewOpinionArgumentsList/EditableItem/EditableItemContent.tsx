import { type FC, type RefObject, type ChangeEvent } from 'react';
import classNames from 'classnames';
import type { THeadingItem, TTextItem } from '../NewOpinionArgumentsList.models';
import { isHeadingItem, isTextItem } from '../NewOpinionArgumentsList.utils';
import { ArgumentCardImage } from '@/widgets/PageWidgets/ArgumentPageWidgets/ArgumentCardImage';
import styles from './EditableItem.module.scss';
import { AutoGrowTextarea } from '@libs/ui-components/form-controls/AutoGrowTextarea';

interface IEditableItemContentProps {
  item: THeadingItem | TTextItem;
  inEditState: boolean;
  value: string;
  setValue: (value: string) => void;
  tempImgFile: string | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export const EditableItemContent: FC<IEditableItemContentProps> = ({
  item,
  inEditState,
  value,
  setValue,
  tempImgFile,
  inputRef,
}) => {
  if (inEditState) {
    return (
      <>
        <AutoGrowTextarea
          inputRef={inputRef}
          className={classNames(styles.textarea, styles[item.type])}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value)}
          placeholder={isHeadingItem(item) ? 'Enter heading text...' : 'Enter text...'}
        />
        {isTextItem(item) && tempImgFile && (
          <div className={styles.imagePreview}>
            <ArgumentCardImage imagePreview={tempImgFile} />
          </div>
        )}
      </>
    );
  }

  // Display mode
  const originalArg = item.metaData?.originalArgument;
  const title = item.title ?? originalArg?.text ?? originalArg?.content ?? '';

  if (isHeadingItem(item)) {
    const HeadingTag = item.type.replace('heading', 'h') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    return <HeadingTag className={classNames(styles.heading, styles[item.type], 'break-all')}>{title}</HeadingTag>;
  }

  if (isTextItem(item)) {
    const imgPreview = item.imgFile || originalArg?.imgUrl;
    return (
      <>
        <p className={classNames(styles.text, 'break-all')}>{title}</p>
        {imgPreview && (
          <div className={styles.imagePreview}>
            <ArgumentCardImage imagePreview={imgPreview} />
          </div>
        )}
      </>
    );
  }

  return null;
};
