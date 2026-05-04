'use client';
import { useMounted } from '@libs/hooks/useMounted';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { getNewOpinionPath } from '@core/utils/path/getTopicVersionPath.util';
import Link from 'next/link';

export const TopicPageButtons: FC = () => {
  const { t } = useTranslation('topicVersion');
  const { locale, topicId } = useParams<{ locale: string; topicId: string }>();

  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className='mx-auto flex w-full max-w-[700px] items-start justify-center gap-2 pb-4'>
      <Link href={getNewOpinionPath({ locale, topicId })}>
        <RoundedButton>{t('writeMyVersion')}</RoundedButton>
      </Link>
      {/* <RoundedButton variant='secondary'>{t('filterVersions')}</RoundedButton> */}
    </div>
  );
};
