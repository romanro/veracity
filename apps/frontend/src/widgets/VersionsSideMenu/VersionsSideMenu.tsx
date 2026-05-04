import { type FC } from 'react';
import { type TVersionsSideMenuProps } from './VersionsSideMenu.models';
import { useTranslation } from 'react-i18next';
import styles from './VersionsSideMenu.module.scss';
import classNames from 'classnames';
import { VersionsSideMenuItem } from './VersionsSideMenuItem';
import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNewOpinionPath } from '@/core/utils/path/getTopicVersionPath.util';

// Inlined to avoid pulling a server-only page module into this client bundle.
type ConsensusRouteParams = { locale: string; topicId?: string; versionId?: string };

export const VersionsSideMenu: FC<TVersionsSideMenuProps> = ({ versions, versionIndex }) => {
  const { t } = useTranslation('topicVersion');
  const params = useParams<ConsensusRouteParams>();
  const { locale, topicId } = params;

  return (
    <aside className='fixed top-[4rem] left-0 z-100 hidden h-[calc(100vh-4rem)] items-center min-[1400px]:max-w-[17rem] xl:flex xl:max-w-[12rem] 2xl:max-w-[20rem]'>
      <div className='p-2 text-sm min-[1400px]:max-w-[17rem] xl:max-w-[12rem] 2xl:max-w-[20rem]'>
        <h4 className={classNames('mb-4 px-1 py-2 capitalize', styles.header)}>{t('versions')}</h4>
        <ul className='flex flex-col gap-4'>
          {versions.map((version, index) => {
            const { id } = version;
            const selected = index === versionIndex;
            return (
              <li key={id} className='flex flex-col gap-2'>
                <VersionsSideMenuItem version={version} selected={selected} />
              </li>
            );
          })}
        </ul>
        <Link href={getNewOpinionPath({ locale, topicId })}>
          <RoundedButton variant='secondary' className='mt-4'>
            {t('createMyVersion')}
          </RoundedButton>
        </Link>
      </div>
    </aside>
  );
};
