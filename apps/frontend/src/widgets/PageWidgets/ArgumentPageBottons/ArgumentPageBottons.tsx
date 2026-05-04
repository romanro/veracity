'use client';
import { type FC } from 'react';
import styles from './ArgumentPageBottons.module.scss';
import classNames from 'classnames';
import { type TArgumentPageBottonsProps } from './ArgumentPageBottons.models';
import { twMerge } from 'tailwind-merge';
import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import { useTranslation } from 'react-i18next';

export const ArgumentPageBottons: FC<TArgumentPageBottonsProps> = ({
  buttonText,
  onPublishButton,
  onClickPublish,
  onClickChangeRefuting,
  setShowCancelModal,
  showChangeToRefuteButton,
  isLoading = false,
}) => {
  const { t } = useTranslation('argumentPage');
  return (
    <div className='flex flex-row justify-between'>
      <div className={classNames(styles.bottonsOpinion)}>
        <RoundedButton
          className={twMerge('m-1', onPublishButton ? '' : 'pointer-events-none')}
          disabled={isLoading}
          onClick={() => onClickPublish()}
        >
          {buttonText}
        </RoundedButton>

        <RoundedButton
          variant='outlined'
          className={classNames(styles.bottonDots, 'm-1')}
          onClick={() => {
            onClickChangeRefuting();
          }}
        >
          ...
        </RoundedButton>
        <RoundedButton
          variant='outlined'
          className={twMerge('m-1', !onPublishButton ? 'pointer-events-none' : '')}
          onClick={() => setShowCancelModal(true)}
        >
          {t('buttonCancel')}
        </RoundedButton>
        {showChangeToRefuteButton && (
          <RoundedButton className='btn-main-black-1 btn-main-size mb-2 text-sm' onClick={onClickChangeRefuting}>
            Change to refutation
          </RoundedButton>
        )}
      </div>
    </div>
  );
};
