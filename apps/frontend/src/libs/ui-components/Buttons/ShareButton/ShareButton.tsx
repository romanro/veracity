import { type FC } from 'react';

import { Share } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import { useToast } from '../../../hooks/useToast/useToast';
import { useTranslation } from 'react-i18next';

type TShareButtonProps = { topicId?: number | string; isTopic?: boolean; hrefConsensus?: string };

export const ShareButton: FC<TShareButtonProps> = ({ topicId, isTopic, hrefConsensus }) => {
  const { success, error } = useToast();
  const { t } = useTranslation('common');

  const onShare = async () => {
    try {
      const currentUrl = isTopic
        ? `${window.location.href}/topics/${topicId ?? ''}`
        : hrefConsensus
          ? `${window.location.origin}${hrefConsensus}`
          : window.location.href;

      await navigator.clipboard.writeText(currentUrl);
      success(t('shareMsg'));
    } catch (err) {
      console.error('Failed to copy URL:', err);
      error(t('shareMsgError'));
    }
  };
  return <IconButton icon={Share} onClick={onShare} />;
};
