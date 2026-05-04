'use client';

import { type FC } from 'react';
import styles from './NewArgumentInputImage.module.scss';
import classNames from 'classnames';
import { Trash } from 'lucide-react';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import type { TNewArgumentInputImageProps } from './NewArgumentInputImage.models';
import { ArgumentCardImage } from '../ArgumentCardImage';
import { NodeEditBar } from '../../NewOpinionPageWidgets/NewOpinionArgumentsList/NodeEditBar/NodeEditBar';

export const NewArgumentInputImage: FC<TNewArgumentInputImageProps> = ({
  setPreview,
  preview,
  isTextArgument,
  onEnterSave,
  onEnterCancel,
}) => {
  const handleImageCropped = (_blob: Blob, url: string, _base64: string) => {
    setPreview(url);
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <>
      {preview && (
        <div className={classNames(styles.previewWrapper)}>
          <ArgumentCardImage imagePreview={preview} />
          <RoundedButton className={classNames(styles.hoverButton)} onClick={clearPreview}>
            <Trash size={24} className='text-black' />
          </RoundedButton>
        </div>
      )}

      <div className={classNames(styles.buttonsWrapper)}>
        <NodeEditBar
          options={[]}
          isValid={!!isTextArgument}
          canBeDeleted={false}
          onTypeChanged={() => {}}
          onCancel={onEnterCancel ?? (() => {})}
          onSave={onEnterSave ?? (() => {})}
          onDelete={() => {}}
          enableImageUpload={true}
          imagePreview={preview}
          onImageCropped={handleImageCropped}
          onImageRemove={clearPreview}
        />
      </div>
    </>
  );
};
