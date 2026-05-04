import { type TAuthorsSummaryProps } from '@/widgets/AuthorsSummary/AuthorsSummary.models';
import { AuthorsSummary } from '@widgets/AuthorsSummary/AuthorsSummary';
import { type FC } from 'react';
import { CommentsSummary } from '../../CommentsSummary';
import { IconButton } from '@libs/ui-components/Buttons/IconButton/IconButton';
import { Bookmark } from 'lucide-react';
import { ShareButton } from '@libs/ui-components/Buttons/ShareButton';

type TTopicCardFooterProps = { countComments?: number } & { topicId?: number | string } & TAuthorsSummaryProps;

// Footer component for topic cards that displays  actions
const TopicCardFooter: FC<TTopicCardFooterProps> = ({ authors, countComments, topicId }) => {
  return (
    <footer className='mt-auto mb-0 flex w-full items-center justify-between gap-3 pb-1'>
      <div className='flex gap-3'>
        <AuthorsSummary authors={authors} limit={3} />
        <CommentsSummary countComments={countComments || 0} />
      </div>
      <div className='flex gap-3'>
        <IconButton icon={Bookmark} />
        <ShareButton topicId={topicId} isTopic={true} />
      </div>
    </footer>
  );
};

export { TopicCardFooter };
