import { type FC } from 'react';
import { type TVersionViewProps } from './VersionView.models';
import { Card } from '@libs/ui-components/Card';
import { VersionScore } from '../VersionsList/VersionPreview/VersionScore/VersionScore';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import { VersionImage } from '../VersionsList/VersionPreview/VersionImage/VersionImage';
import { AuthorsSummary } from '../AuthorsSummary/AuthorsSummary';
import styles from './VersionView.module.scss';

export const VersionView: FC<TVersionViewProps> = ({ version, isLoading }) => {
  const { reliability = 0, title, description, srcImg = '', authors = [] } = version ?? {};

  return (
    <Card>
      <div className='flex-column gap-4'>
        {isLoading ? (
          <ShimmerPlaceholder width='100%' height={200} />
        ) : (
          <>
            <VersionScore reliability={reliability} />
            <article className='flex flex-col gap-4 py-3'>
              <article className='flex flex-col gap-4'>
                <h3 className='text-(length:--font-size-md) break-all'>{title}</h3>
                {description && <p className='break-all'>{description}</p>}
              </article>
              <AuthorsSummary authors={authors} limit={3} />
            </article>
            {srcImg && <VersionImage src={srcImg} alt={title} className={styles.image} />}
          </>
        )}
      </div>
    </Card>
  );
};
