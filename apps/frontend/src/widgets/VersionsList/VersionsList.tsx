import { type FC } from 'react';
import { type TVersionsListProps } from './VersionsList.models';
import { Skeleton } from '@libs/ui-components/Skeleton';
import { VersionPreview } from './VersionPreview';

export const VersionsList: FC<TVersionsListProps> = ({ isLoading, versions }) => {
  return (
    <ul className='!mb-6 flex flex-col gap-4'>
      {isLoading ? (
        <Skeleton count={5} shimmerProps={{ width: '100%', height: 100 }} />
      ) : (
        <>
          {versions.map((version) => (
            <li key={version.id}>
              <VersionPreview version={version} />
            </li>
          ))}
        </>
      )}
    </ul>
  );
};
