'use client';

import { Avatar } from '@libs/ui-components/Avatar';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { useUser } from '@clerk/nextjs';
import { Card } from '@libs/ui-components/Card';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dot } from 'lucide-react';
import { type TNewArgumentCreateInputProps } from './NewArgumentCreateInput.models';
import { SearchField } from '@/libs/ui-components/SearchField';
import styles from './NewArgumentCreateInput.module.scss';
import classNames from 'classnames';
import { blockRounded } from '../../../../core/constants/uiContent';
import { NewArgumentInputImage } from '../NewArgumentInputImage';

export const NewArgumentCreateInput: FC<TNewArgumentCreateInputProps> = ({
  onEnterConfirm,
  textNewArgument,
  isImage = false,
  setPreview,
  preview,
  onEnterCancelArgument,
}) => {
  const [isTextArgument, setIsTextArgument] = useState<string>('');
  const [isSaveArgument, setIsSaveArgument] = useState<boolean>(false);
  const { user } = useUser();
  const { imageUrl, fullName } = user ?? {};
  const { t } = useTranslation('argumentPage');

  const onEnterSave = () => {
    onEnterConfirm(isTextArgument);
    setIsSaveArgument(true);
    setIsTextArgument('');
  };

  const onEnterCancel = () => {
    setIsSaveArgument(true);
    setIsTextArgument('');
    onEnterCancelArgument?.();
  };

  return (
    <Card className={classNames(styles.mainInputCard, blockRounded)}>
      <div className='flex w-full flex-col items-center gap-4 p-3'>
        <div className='flex w-full items-center gap-4'>
          <span className='flex items-center gap-2 text-(--color-text-secondary)'>
            {imageUrl ? <Avatar avatar={imageUrl} size={32} /> : <UserDotAvatar />}
            {fullName && (
              <>
                {fullName} <Dot />
              </>
            )}
          </span>
          <SearchField
            classNames={{
              wrapper: 'flex flex-1 resize-none items-center border-none outline-none focus:ring-0 focus:outline-none',
            }}
            placeholder={t('writeNewArgument')}
            showFindButton={false}
            initialValue={textNewArgument}
            onSearch={onEnterConfirm}
            clearTextWithEnter={true}
            onChangeText={(value) => setIsTextArgument(value.trim())}
            isSaveArgument={isSaveArgument}
          />
        </div>
      </div>
      {isImage ? (
        <NewArgumentInputImage
          isTextArgument={!!isTextArgument}
          setPreview={setPreview ?? (() => {})}
          preview={preview === undefined ? null : preview}
          onEnterSave={onEnterSave}
          onEnterCancel={onEnterCancel}
        />
      ) : (
        <> </>
      )}
    </Card>
  );
};
