'use client';

import { Card } from '@libs/ui-components/Card';
import { type ChangeEvent, useState, type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NewOpinionTabFooter } from '../NewOpinionTabFooter';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import { type TNewOpinionTopicProps } from './NewOpinionTopic.models';
import { AutoGrowTextarea } from '@libs/ui-components/form-controls/AutoGrowTextarea';
import { useToast } from '@libs/hooks/useToast/useToast';
import { useGetProfile } from '@core/api/hooks/useGetProfile';

export const NewOpinionTopic: FC<TNewOpinionTopicProps> = ({
  isLoading,
  topic,
  children,
  onTopicSelected,
  onStepStatusChanged,
  onCancel,
}) => {
  const { t } = useTranslation('newOpinionPage');
  const [localText, setLocalText] = useState(topic?.title ?? '');
  const toast = useToast();
  const { data: user } = useGetProfile();

  useEffect(() => {
    setLocalText(topic?.title ?? '');
  }, [topic?.title]);

  if (isLoading) return <ShimmerPlaceholder className='w-full max-w-[980px] gap-4 !p-4' height={300} />;

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
    onStepStatusChanged?.('TOPIC', !!e.target.value);
  };

  const isNew = !topic?.id;
  const isEditable =
    topic?.versions?.length === 1 &&
    topic.versions[0].authors?.length === 1 &&
    topic.versions[0].authors[0].id === user?.id;
  const isReadOnly = !isEditable && !isNew;

  const onNextClick = () => {
    const newTopic = { ...topic, title: localText };
    const valid = newTopic?.title?.length > 10;
    if (valid) {
      onTopicSelected?.({ ...(newTopic ?? {}) }, valid);
    } else {
      toast.error(t('topicError'));
    }
  };

  return (
    <section className="grid grid-cols-[2fr_1fr]">
      <div className='flex flex-col gap-4'>
        {children}
        <Card className='w-full max-w-[980px] gap-4 !p-4'>
          <div className='flex flex-col gap-4 p-2'>
            <h2 className='text-(length:--font-size-md) text-(--color-text-primary)'>
              {isReadOnly ? t('selectedTopic') : t('createNewTopic')}
            </h2>
            <p className='text-(length:--font-size-base) text-(--color-text-primary)'>
              {isReadOnly ? topic?.title : t('topic')}
            </p>
            <p className='text-(length:--font-size-sm) text-(--color-text-secondary)'>
              {isReadOnly ? topic?.subject : t('topicHint')}
            </p>
            {isReadOnly ? null : (
              <AutoGrowTextarea
                className='w-full'
                placeholder={t('topicPlaceholder')}
                value={localText}
                onChange={onChange}
              />
            )}
            <NewOpinionTabFooter onNextClick={onNextClick} onCancel={onCancel} />
          </div>
        </Card>
      </div>
    </section>
  );
};
