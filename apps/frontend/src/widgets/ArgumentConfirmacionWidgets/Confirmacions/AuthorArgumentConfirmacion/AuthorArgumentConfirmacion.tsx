import { type FC } from 'react';
import { useRouter } from 'next/navigation';

import { twMerge } from 'tailwind-merge';
import styles from './AuthorArgumentConfirmacion.module.scss';
import classNames from 'classnames';
import { type TAuthorArgumentConfirmacion } from './AuthorArgumentConfirmacion.models';

import { AuthorTitle } from '../../AuthorTitle';
import { useTranslation } from 'react-i18next';
import { blockRounded } from '../../../../core/constants/uiContent';

export const AuthorArgumentConfirmacion: FC<TAuthorArgumentConfirmacion> = ({ argument, themeTitle, versionTitle }) => {
  const _router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className={twMerge(blockRounded)}>
      <div className='p-4'>
        <AuthorTitle
          avatar={argument?.authors?.[0]?.avatar ?? ''}
          nameFull={argument?.authors?.[0]?.name ?? ''}
          rating={argument?.authors?.[0].rating as number}
          createdDate={argument?.createdDate ?? ''}
        />
        <div className='flex flex-col'>
          <div>
            <span className={classNames(styles.textName)}>{t('topicName')}</span>

            <span className={classNames(styles.titleThemeVersion)}> {themeTitle} </span>
          </div>
          <div>
            <span className={classNames(styles.textName)}>{t('versionName')}</span>
            <span className={classNames(styles.titleThemeVersion)}> {versionTitle.slice(0, 108)} </span>
          </div>
        </div>
        <div className='text-justifyfont-normal text-btn-1 my-4 max-w-4xl text-base text-wrap'>
          {argument?.title ?? ''}
        </div>
      </div>
    </div>
  );
};
