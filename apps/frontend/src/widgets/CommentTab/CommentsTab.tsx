import { EmptyList } from '@/libs/ui-components/EmptyList';
import { MessageCircleX } from 'lucide-react';
import { type FC } from 'react';

export const CommentsTab: FC = () => {
  return <EmptyList title='No comments found' iconComponent={MessageCircleX} />;
};
