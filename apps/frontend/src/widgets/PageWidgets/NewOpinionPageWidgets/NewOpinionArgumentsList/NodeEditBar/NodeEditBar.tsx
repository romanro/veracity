'use client';

import { CompactRectButton } from '@libs/ui-components/Buttons/Compact/CompactRectButton';
import { memo, useState, type FC } from 'react';
import type { TNodeEditBarProps } from './NodeEditBar.models';
import { useTranslation } from 'react-i18next';
import { ImageUp, X } from 'lucide-react';
import { FIXED_WIDTH, FIXED_HEIGHT } from '@/core/constants/uiContent';
import dynamic from 'next/dynamic';
import { CompactSelect } from '@libs/ui-components/CompactSelect';
import type { TNodeType } from '../../NewOpinionArgumentsTree/NewOpinionArgumentsTree.models';

const buttonClasses = 'flex items-center gap-2';

const ImageCropModal = dynamic(
  () => import('@libs/ui-components/Modal/ImageCropModal').then((mod) => mod.ImageCropModal),
  {
    ssr: false,
    loading: () => null,
  }
);

export const NodeEditBar: FC<TNodeEditBarProps> = memo(
  ({
    type,
    options,
    isValid,
    onCancel,
    onDelete,
    onSave,
    onTypeChanged,
    canBeDeleted,
    showTypeSelect = true,
    enableImageUpload = false,
    imagePreview,
    onImageCropped,
    onImageRemove,
  }) => {
    const { t } = useTranslation('argumentPage');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageCropped = (blob: Blob, url: string, base64: string) => {
      onImageCropped?.(blob, url, base64);
    };

    const handleImageRemove = () => {
      onImageRemove?.();
    };

    return (
      <>
        {enableImageUpload && (
          <ImageCropModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onImageCropped={handleImageCropped}
            targetWidth={FIXED_WIDTH}
            targetHeight={FIXED_HEIGHT}
          />
        )}

        <div className='flex items-center justify-between gap-2 py-2'>
          <div className='flex items-center gap-2'>
            {showTypeSelect && type && (
              <CompactSelect<TNodeType>
                value={type}
                options={options}
                disabled={!canBeDeleted}
                onChange={onTypeChanged}
              />
            )}
            {enableImageUpload && (
              <>
                {!imagePreview ? (
                  <CompactRectButton
                    variant='secondary'
                    onClick={() => setIsModalOpen(true)}
                    className={buttonClasses}
                    title='Add image'
                  >
                    <ImageUp size={16} />
                  </CompactRectButton>
                ) : (
                  <CompactRectButton
                    variant='link'
                    onClick={handleImageRemove}
                    className={buttonClasses}
                    title='Remove image'
                  >
                    <X size={16} />
                    Remove Image
                  </CompactRectButton>
                )}
              </>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {canBeDeleted && (
              <CompactRectButton variant='link' onClick={onDelete} className={buttonClasses}>
                {t('delete')}
              </CompactRectButton>
            )}
            <CompactRectButton variant='secondary' onClick={onCancel} className={buttonClasses}>
              {t('cancel')}
            </CompactRectButton>
            <CompactRectButton disabled={!isValid} onClick={onSave} className={buttonClasses}>
              {t('save')}
            </CompactRectButton>
          </div>
        </div>
      </>
    );
  }
);

NodeEditBar.displayName = 'NodeEditBar';
