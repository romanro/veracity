'use client';
import { useEffect, useState, type FC } from 'react';

import styles from './ArgumentPageLeft.module.scss';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { useUser } from '@clerk/clerk-react';
import { useLocaleRouter } from '@/libs/hooks/useLocaleRouter';
import { useRouter } from 'next/navigation';
import { ModalConfirmation } from '@/libs/ui-components/Modal/ModalConfirmation';
import { Card } from '@libs/ui-components/Card';
import { AuthorArgumentConfirmacion } from '@/widgets/ArgumentConfirmacionWidgets/Confirmacions/AuthorArgumentConfirmacion';
import { Indicator } from '@/widgets/ArgumentConfirmacionWidgets/Opinions/Indicator/Indicator';
import { type TArgument } from '@/core/models/Argument.model';
import { type TArgumentPageLeftProps } from './ArgumentPageLeft.models';
import { ArgumentPageBottons } from '../ArgumentPageBottons';
import { ArgumentCreateContainer } from '../ArgumentCreateContainer';
import { useTranslation } from 'react-i18next';
import { calculateIndicatorValue } from './ArgumentPageLeft.utils';
import { usePostArguments } from '../ConsensusPageWidgets/usePostArguments';
import { useListArguments } from '@/libs/hooks/useListArguments/useListArguments';
import { ImageLoaderError } from '@/libs/ui-components/ImageLoader/ImageLoaderError';
import { useArgumentsButtonState } from '@/libs/hooks/useArgumentButtonState/useArgumentButtonState';
import { newArgumentId } from '@/core/constants/argument';
import { useDispatch } from 'react-redux';
import { setArguments } from '@/store/argumentsSlice';
import { blockRounded } from '../../../core/constants/uiContent';
import { createBase64FromPreview } from '../../../functions/formatDate';

export const ArgumentPageLeft: FC<TArgumentPageLeftProps> = ({
  topic,
  version,
  argument,
  typeArguments,
  onClickCanel,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('argumentPage');

  const { user } = useUser();
  const [valueIndicator, setValueIndicator] = useState<number>(-1);
  const { pushLocalePath } = useLocaleRouter();
  const [showChangeToRefuteButton] = useState(false);
  const postArguments = usePostArguments();

  const { isProof, setIsProof, onPublishButton, showCancelModal, setShowCancelModal } = useArgumentsButtonState({
    typeArguments,
  });

  const myListNewArguments = useListArguments();
  useEffect(() => {
    setValueIndicator(calculateIndicatorValue(myListNewArguments));
  }, [myListNewArguments]);

  const onClickPublish = async () => {
    if (!user) {
      pushLocalePath('/sign');
      return;
    } else {
      const preparedArgs = await Promise.all(
        myListNewArguments.map(async (arg) => ({
          argumentId: String(arg.id).indexOf(newArgumentId) === 0 ? '0' : arg.id,
          argumentText: arg.text as string,
          imgFile: String(arg.id).indexOf(newArgumentId) === 0 ? await createBase64FromPreview(arg.imgUrl ?? '') : null,
        }))
      );

      postArguments.mutate(
        {
          asProof: isProof,
          argumentId: argument.id,
          arguments: preparedArgs,
        },
        {
          onSuccess: () => {
            dispatch(setArguments([]));
            router.back();
          },
          onError: (error) => {
            console.error('Error sending arguments:', error);
          },
        }
      );
    }
  };

  const onClickChangeRefuting = () => {
    setIsProof(!isProof);
  };

  const handleDiscard = () => {
    dispatch(setArguments([]));
    setShowCancelModal(false);
    if (onClickCanel) {
      onClickCanel();
    }
  };

  const buttonText = isProof ? t('publishConfirmation') : t('publishRefutation');

  return (
    <Card className='m-1 flex h-screen w-[60%] flex-col flex-nowrap overflow-hidden overflow-y-scroll p-2 pb-24 whitespace-nowrap'>
      <div className='mb-2'>
        <div className={twMerge(blockRounded, '')}>
          <h1 className={classNames(styles.opinionVersion)}>{t('titlePartLeft')}</h1>
          <AuthorArgumentConfirmacion
            argument={argument as TArgument}
            themeTitle={topic?.title ?? ''}
            versionTitle={version?.title ?? ''}
          />
          <ArgumentPageBottons
            buttonText={buttonText}
            onPublishButton={onPublishButton}
            onClickPublish={onClickPublish}
            onClickChangeRefuting={onClickChangeRefuting}
            setShowCancelModal={setShowCancelModal}
            showChangeToRefuteButton={showChangeToRefuteButton}
            isLoading={postArguments.isPending}
          />
        </div>

        <div className={twMerge(blockRounded, 'pointer-events-none')}>
          <h3 className={classNames(styles.nameColor, styles.pageOpinionTheme)}>{t('indicatorTitle')}</h3>
          <Indicator active={valueIndicator} />
        </div>
        <ModalConfirmation
          headerText={t('modalClose')}
          bodyText={t('modalCloseBody')}
          showCancelModal={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          handleDiscard={handleDiscard}
          confirmBtnLabel={t('buttonDiscard')}
          cancelBtnLabel={t('buttonCancel')}
        />
      </div>
      <ArgumentCreateContainer />
      {postArguments.isError && <ImageLoaderError width={200} height={200} className='relative overflow-hidden' />}
    </Card>
  );
};
