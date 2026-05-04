'use client';

import { Avatar } from '@libs/ui-components/Avatar';
import { useUser } from '@clerk/nextjs';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import { UserDotAvatar } from '@/libs/ui-components/UserDotAvatar';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNewOpinionPath } from '@/core/utils/path/getTopicVersionPath.util';

// Inlined to avoid pulling a server-only page module into this client bundle.
type ConsensusRouteParams = { locale: string; topicId?: string; versionId?: string };

export const NewOpinionInput = () => {
  const { user } = useUser();

  const { imageUrl } = user ?? {};
  const { t } = useTranslation('consensusPage');

  const params = useParams<ConsensusRouteParams>();
  const { locale, topicId, versionId } = params;

  return (
    <Link href={getNewOpinionPath({ locale, topicId, versionId })}>
      <div className='flex w-full items-center gap-4 rounded-[var(--radius-card)] bg-(--color-bg-primary) p-3'>
        {imageUrl ? <Avatar avatar={imageUrl} size={32} /> : <UserDotAvatar />}
        <span className='flex flex-1 resize-none items-center'>{t('writeOpinion')}</span>
        <RoundedButton className='m-1'>{t('publish')}</RoundedButton>
      </div>
    </Link>
  );
};
