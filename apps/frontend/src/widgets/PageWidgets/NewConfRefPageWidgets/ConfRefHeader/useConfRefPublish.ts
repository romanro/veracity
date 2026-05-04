'use client';

import { type MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useClerk, useUser } from '@clerk/nextjs';
import { useToast } from '@/libs/hooks/useToast/useToast';
import { useLocaleRouter } from '@/libs/hooks/useLocaleRouter';
import { usePostArguments } from '@widgets/PageWidgets/ConsensusPageWidgets/usePostArguments';
import { type TNewOpinionArgumentsListRef } from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList';
import {
  type TArgumentItem,
  type TListItem,
  type TTextItem,
} from '@widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';
import { type TCreateItemArgument } from '@core/api/models/Argument.api.models';

interface IUseConfRefPublishParams {
  argumentsListRef: MutableRefObject<TNewOpinionArgumentsListRef | null>;
  argumentId: string;
  topicId: string;
  versionId: string;
  isApprove: boolean;
}

interface IUseConfRefPublishReturn {
  onPublish: () => void;
  isPending: boolean;
}

const itemToCreateArgument = (item: TListItem): TCreateItemArgument | null => {
  if (item.type === 'argument') {
    const arg = item as TArgumentItem;
    const originalId = arg.originalArgumentId ?? arg.metaData?.originalArgument?.id;
    return {
      argumentId: originalId ? String(originalId) : null,
      argumentText: arg.metaData?.originalArgument?.text ?? arg.text ?? '',
    };
  }

  if (item.type === 'text') {
    const text = item as TTextItem;
    return {
      argumentId: null,
      argumentText: text.title ?? '',
    };
  }

  return null;
};

export const useConfRefPublish = ({
  argumentsListRef,
  argumentId,
  topicId,
  versionId,
  isApprove,
}: IUseConfRefPublishParams): IUseConfRefPublishReturn => {
  const { t } = useTranslation('newOpinionPage');
  const { mutate, isPending } = usePostArguments();
  const toast = useToast();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { pushLocalePath } = useLocaleRouter();

  const onPublish = () => {
    if (!isSignedIn) {
      toast.error(t('publishErrorNotSignedIn'));
      openSignIn();
      return;
    }

    if (!argumentsListRef.current) {
      toast.error(t('publishErrorMissingData'));
      return;
    }

    const { items = [] } = argumentsListRef.current.getList();
    const argumentsPayload = items
      .map(itemToCreateArgument)
      .filter((entry): entry is TCreateItemArgument => entry !== null);

    mutate(
      {
        asProof: isApprove,
        argumentId,
        arguments: argumentsPayload,
      },
      {
        onSuccess: () => {
          toast.success(t('publishSuccess'));
          pushLocalePath(`/topics/${topicId}/versions/${versionId}/arguments/${argumentId}`);
        },
        onError: (error) => {
          toast.error(t('publishErrorFailed'));
          console.error('Publish error:', error);
        },
      }
    );
  };

  return { onPublish, isPending };
};
