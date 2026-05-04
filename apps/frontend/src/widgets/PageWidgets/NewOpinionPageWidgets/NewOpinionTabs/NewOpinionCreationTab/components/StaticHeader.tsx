import { memo, type FC, type MutableRefObject } from 'react';
import type { TTopic } from '@core/models/Topic.model';
import type { TVersion } from '@core/models/Version.model';
import type { TNewOpinionTabsProps } from '../../NewOpinionTabs.model';
import { NewOpinionTopicVersionCard } from '../NewOpinionTopicVersionCard';
import type { TNewOpinionArgumentsListRef } from '../../../NewOpinionArgumentsList';
import { useOpinionPublish } from '../hooks/useOpinionPublish';

interface IStaticHeaderProps {
  topic?: Partial<TTopic>;
  version?: Partial<TVersion>;
  onCancel: TNewOpinionTabsProps['onCancel'];
  isTreeValid: boolean;
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
}

export const StaticHeader: FC<IStaticHeaderProps> = memo(
  ({ topic, version, onCancel, isTreeValid, argumentsListRef }) => {
    const { onPublish, isPending } = useOpinionPublish({
      argumentsListRef,
      version,
      topic,
    });

    return (
      <div>
        <NewOpinionTopicVersionCard
          topic={topic}
          version={version}
          onCancel={onCancel}
          onPublish={onPublish}
          isTreeValid={isTreeValid}
          isPublishing={isPending}
        />
      </div>
    );
  }
);

StaticHeader.displayName = 'StaticHeader';
