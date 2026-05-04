import { type FC } from 'react';
import { RoundedButton } from '../Buttons/RoundedButton';
import { useIntersectionObserver } from '@libs/hooks/useIntersectionObserver';
import { type TFetchNextPageButtonProps } from './FetchNextPageButton.models';

const FetchNextPageButton: FC<TFetchNextPageButtonProps> = ({ isFetchingNextPage, hasNextPage, fetchNextPage }) => {
  const fetchNextPageHandler = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  };

  const loadMoreRef = useIntersectionObserver<HTMLButtonElement>(fetchNextPageHandler, { rootMargin: '100px' });

  return hasNextPage && fetchNextPage ? (
    <div className='flex-center flex pt-4'>
      <RoundedButton
        ref={loadMoreRef}
        variant='secondary'
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
      </RoundedButton>
    </div>
  ) : null;
};

export { FetchNextPageButton };
