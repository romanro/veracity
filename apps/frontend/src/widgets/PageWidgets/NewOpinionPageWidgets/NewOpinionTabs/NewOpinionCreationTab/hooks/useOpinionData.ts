import { useMemo } from 'react';
import { useGetProfile } from '@/core/api/hooks/useGetProfile';
import { useGetOpinionArguments } from '@/widgets/OpinionOfUserList/useGetOpinionArguments';
import { useArgumentSearchParams } from '@/widgets/PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';
import { useListPersistence } from './useListPersistence';
import type { TListDocument, TListItem } from '../../../NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import type { TArgument } from '@core/models/Argument.model';
import type { ArgumentListItem } from '@core/api/models/Argument.api.models';

function mapArgumentListItemToListItem(item: ArgumentListItem, index: number): TListItem {
  const baseAuthor = { id: String(item.author.id), name: item.author.name, avatar: item.author.avatar };

  if (item.type === 'argument') {
    // For reused argument items, preserve the original argument's author
    // instead of using the top-level item.author (which may be the opinion owner)
    const originalArg = item as ArgumentListItem & { originalArgument?: TArgument; originalArgumentId?: string };
    const argumentAuthor = originalArg.originalArgument?.author
      ? { id: String(originalArg.originalArgument.author.id), name: originalArg.originalArgument.author.name, avatar: originalArg.originalArgument.author.avatar }
      : baseAuthor;

    return {
      id: item.id,
      index,
      type: 'argument',
      originalArgumentId: originalArg.originalArgumentId ?? item.id,
      metaData: {
        author: argumentAuthor,
        createdDate: new Date(item.createdDate),
        originalArgument: item as TArgument,
      },
    };
  }

  const title = item.title ?? item.content ?? item.text ?? '';
  return {
    id: item.id,
    index,
    type: item.type as Exclude<TListItem['type'], 'argument'>,
    title,
    metaData: {
      author: baseAuthor,
      createdDate: new Date(item.createdDate),
    },
  } as TListItem;
}

interface IUseOpinionDataParams {
  topicId?: string;
  versionId?: string;
}

interface IUseOpinionDataReturn {
  initialList: TListDocument | undefined;
  initialUsedArguments: TArgument[] | undefined;
  handleStateChange: (list: TListDocument, usedArguments: TArgument[]) => void;
  isLoadingFromServer: boolean;
  effectiveUserId: string | undefined;
}

/**
 * Custom hook to handle opinion data from both server and localStorage
 * - Prioritizes server data over localStorage
 * - Falls back to localStorage if server data is not available
 * - Supports both URL-based userId (for viewing) and current user (for editing)
 */
export const useOpinionData = ({ topicId, versionId }: IUseOpinionDataParams): IUseOpinionDataReturn => {
  // Get userId from URL params (for viewing other users' opinions)
  const { userId: urlUserId } = useArgumentSearchParams();

  // Get current logged-in user's profile (fallback for editing own opinion)
  const { data: profile } = useGetProfile();

  // Determine effective userId: URL params first, then profile userId
  const effectiveUserId = useMemo(() => {
    if (urlUserId) return urlUserId;
    if (profile?.id) return String(profile.id);
    return undefined;
  }, [urlUserId, profile?.id]);

  // Fetch from server when we have versionId and effectiveUserId
  const {
    data: serverData,
    isLoading: isLoadingFromServer,
    error: serverError,
  } = useGetOpinionArguments({
    versionId: versionId || '',
    userId: effectiveUserId,
  });

  // Get localStorage data as fallback
  const {
    initialList: localStorageList,
    initialUsedArguments: localStorageUsedArguments,
    handleStateChange,
  } = useListPersistence({
    userId: effectiveUserId,
    topicId,
    versionId,
  });

  // Prioritize server data over localStorage
  const initialList = useMemo((): TListDocument | undefined => {
    if (serverData?.arguments.data && !serverError) {
      const items = serverData.arguments.data.map(mapArgumentListItemToListItem);
      return {
        id: 'root',
        items,
      };
    }
    return localStorageList;
  }, [serverData, serverError, localStorageList]);

  const initialUsedArguments = useMemo(() => {
    // If we have server data and no error, extract usedArguments
    if (serverData && !serverError) {
      // Server data might include usedArguments in the response
      // For now, we'll extract from the items if they have originalArgumentId
      const usedArgs: TArgument[] = [];
      serverData.arguments.data?.forEach((item) => {
        if ((item.type === 'argument' || item.type === 'text')) {
          // Try to find the argument in localStorage or create a placeholder
          const existingArg = localStorageUsedArguments?.find((arg) => arg.id === item.id);
          if (existingArg) {
            usedArgs.push(existingArg);
          }
        }
      });
      return usedArgs.length > 0 ? usedArgs : localStorageUsedArguments;
    }
    // Otherwise, fall back to localStorage
    return localStorageUsedArguments;
  }, [serverData, serverError, localStorageUsedArguments]);

  return {
    initialList,
    initialUsedArguments,
    handleStateChange,
    isLoadingFromServer,
    effectiveUserId,
  };
};
