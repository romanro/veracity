'use client';
import { useEffect, type MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import type { TTopic } from '@core/models/Topic.model';
import type { TVersion } from '@core/models/Version.model';
import type { TNewOpinionArgumentsListRef } from '../../../NewOpinionArgumentsList';
import type { TOpinionArgumentsSubmitBody } from '@core/api/models/Argument.api.models';
import { useSubmitOpinionArguments } from '@/core/api/hooks/useSubmitOpinionArguments';
import { useToast } from '@/libs/hooks/useToast/useToast';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePendingPublish } from './usePendingPublish';
import { useRouter } from 'next/navigation';
import { useTopicVersionPath } from '@libs/hooks/useTopicVersionPath';
import { useGetProfile } from '@core/api/hooks/useGetProfile';


interface IUseOpinionPublishParams {
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  version?: Partial<TVersion>;
  topic?: Partial<TTopic>;
}

interface IUseOpinionPublishReturn {
  onPublish: () => void;
  isPending: boolean;
}

const sanitizeItems = (items: TOpinionArgumentsSubmitBody['items']): TOpinionArgumentsSubmitBody['items'] => {
  return items.map((item) => {
    const id = typeof item.id === 'string' ? item.id : String(item.id);

    if (item.type === 'argument') {
      return {
        ...item,
        id,
        originalArgumentId: item.originalArgumentId ? String(item.originalArgumentId) : undefined,
      };
    }

    return {
      ...item,
      id,
    };
  });
};

/**
 * Custom hook for managing opinion publish flow with authentication
 *
 * Handles:
 * - Authentication check before publish
 * - Saving opinion data to localStorage before OAuth redirect
 * - Auto-publishing after successful authentication
 * - Complete opinion data persistence across redirects
 *
 * @param params - argumentsListRef, version, and topic data
 * @returns onPublish handler and isPending state
 */
export const useOpinionPublish = ({
  argumentsListRef,
  version,
  topic,
}: IUseOpinionPublishParams): IUseOpinionPublishReturn => {
  const { t } = useTranslation('newOpinionPage');
  const { mutate, isPending } = useSubmitOpinionArguments();
  const toast = useToast();
  const { isSignedIn } = useUser();
  const { data: user } = useGetProfile();
  const { openSignIn } = useClerk();
  const { setPendingPublish, checkAndClearPendingPublish } = usePendingPublish();
  const router = useRouter();

  const { getPath } = useTopicVersionPath();

  // Extract publish logic to reuse in both manual and auto-trigger scenarios
  const executePublish = (savedData?: {
    userId?: string | number;
    versionId: string;
    topicId?: string;
    topic?: string;
    version?: string;
    items: TOpinionArgumentsSubmitBody['items'];
  }) => {
    // Use saved data if provided, otherwise read from current state
    let body: TOpinionArgumentsSubmitBody;

    if (savedData) {
      // Using saved data from localStorage (after auth redirect)
      body = {
        versionId: savedData.versionId,
        topicId: savedData.topicId,
        topic: savedData.topic,
        version: savedData.version,
        items: sanitizeItems(savedData.items),
      };
    } else {
      // Using current state (normal publish flow)
      if (!argumentsListRef.current) {
        toast.error(t('publishErrorMissingData'));
        return;
      }

      const { items = [] } = argumentsListRef.current.getList();

      body = {
        versionId: version?.id,
        topicId: topic?.id,
        topic: topic?.title,
        version: version?.title,
        items: sanitizeItems(items),
      };
    }

    mutate(
      { data: body },
      {
        onSuccess: (response) => {
          toast.success(t('publishSuccess'));
          const { topicId, versionId } = response;
          if (topicId && version) {
            const href = getPath({ topicId, versionId, authorId: user?.id });
            router.push(href);
          }
        },
        onError: (error) => {
          toast.error(t('publishErrorFailed'));
          console.error('Publish error:', error);
        },
      }
    );
  };

  // Auto-trigger publish after successful sign-in (including OAuth redirects)
  useEffect(() => {
    if (isSignedIn && version?.id) {
      const pendingData = checkAndClearPendingPublish(version.id);
      if (pendingData) {
        executePublish(pendingData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, version?.id]);

  const onPublish = () => {
    // Check if user is authenticated
    if (!isSignedIn) {
      toast.error(t('publishErrorNotSignedIn'));

      // Save complete opinion data to localStorage (persists across OAuth redirects)
      if (version?.id && argumentsListRef.current) {
        const { items = [] } = argumentsListRef.current.getList();

        setPendingPublish({
          userId: user?.id,
          versionId: version.id,
          topicId: topic?.id,
          topic: topic?.title,
          version: version?.title,
          items,
        });
      }

      openSignIn();
      return;
    }

    // User is authenticated, proceed with publish
    executePublish();
  };

  return {
    onPublish,
    isPending,
  };
};
