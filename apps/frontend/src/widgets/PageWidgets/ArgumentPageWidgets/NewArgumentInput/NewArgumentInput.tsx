'use client';
import { Avatar } from '@libs/ui-components/Avatar';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import { UserDotAvatar } from '@libs/ui-components/UserDotAvatar';
import { useUser } from '@clerk/nextjs';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dot } from 'lucide-react';
import { useMounted } from '@libs/hooks/useMounted';
import { type TNewArgumentInputProps } from './NewArgumentInput.models';

export const NewArgumentInput: FC<TNewArgumentInputProps> = ({ tab, onEnterConfirm, buttonConfirm = true }) => {
  const { user } = useUser();
  const { imageUrl, fullName } = user ?? {};
  const { t } = useTranslation('argumentPage');

  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <div
      role='button'
      tabIndex={0}
      className='flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius-card)] bg-(--color-bg-primary) !p-3'
      onClick={onEnterConfirm}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onEnterConfirm?.();
        }
      }}
    >
      <div className='flex w-full items-center gap-4'>
        <span className='flex items-center gap-2 text-(--color-text-secondary)'>
          {imageUrl ? <Avatar avatar={imageUrl} size={32} /> : <UserDotAvatar />}
          {fullName && (
            <>
              {fullName} <Dot />
            </>
          )}
        </span>
        <span className='flex h-full w-full resize-none items-center'>
          {tab === 'approve' ? t('writeConfirmation') : t('writeRefutation')}
        </span>
      </div>
      {buttonConfirm && (
        <div className='flex items-center justify-end gap-4'>
          <RoundedButton className='m-1'>{tab === 'approve' ? t('confirm') : t('refute')}</RoundedButton>
        </div>
      )}
    </div>
  );
};
