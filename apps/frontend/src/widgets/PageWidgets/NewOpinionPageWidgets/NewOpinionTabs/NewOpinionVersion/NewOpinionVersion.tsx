'use client';

import { Card } from '@libs/ui-components/Card';
import { type ChangeEvent, useState, type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NewOpinionTabFooter } from '../NewOpinionTabFooter';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import type { TNewOpinionVersionProps } from './NewOpinionVersion.models';
import { AutoGrowTextarea } from '@libs/ui-components/form-controls/AutoGrowTextarea';
import { useToast } from '@libs/hooks/useToast/useToast';
import { useGetProfile } from '@core/api/hooks/useGetProfile';

export const NewOpinionVersion: FC<TNewOpinionVersionProps> = ({
  isLoading,
  topicTitle,
  version,
  children,
  onVersionSelected,
  onStepStatusChanged,
  onCancel,
}) => {
  const { t } = useTranslation('newOpinionPage');

  const [localText, setLocalText] = useState({ title: version?.title ?? '', description: version?.description ?? '' });
  const toast = useToast();
  const { data: user } = useGetProfile();
  useEffect(() => {
    setLocalText({ title: version?.title ?? '', description: version?.description ?? '' });
  }, [version?.title, version?.description]);

  if (isLoading) return <ShimmerPlaceholder className='w-full max-w-[980px] gap-4 !p-4' height={300} />;

  const onChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText((text) => ({ ...text, title: e.target.value }));
    onStepStatusChanged?.('VERSION', !!e.target.value);
  };

  const isNewVersion = !version?.id;

  const isEditable = version?.authors?.length === 1 ? version.authors[0].id === user?.id : false;

  const isReadOnly = !isEditable && !isNewVersion;

  const onNextClick = () => {
    const { title, description } = localText;
    const newVersion = { ...version, title, description };
    const valid = newVersion?.title?.length > 10;
    if (valid) {
      onVersionSelected?.({ ...(newVersion ?? {}) }, valid);
    } else {
      toast.error(t('versionError'));
    }
  };

  return (
    <section className="grid grid-cols-[2fr_1fr] overflow-hidden max-w-full">
      <div className='flex max-w-full flex-col gap-4 overflow-hidden'>
        {children}
        <Card className='w-full max-w-[980px] gap-4 overflow-hidden !p-4'>
          <div className='flex max-w-full flex-col gap-4 p-2'>
            <h2 className='text-(length:--font-size-md) break-all text-(--color-text-primary)'>
              {isReadOnly ? t('selectedVersion') : t('createNewVersion')}
            </h2>
            {topicTitle && (
              <p className='text-(length:--font-size-base) break-all text-(--color-text-primary)'>{topicTitle}</p>
            )}
            <p className='text-(length:--font-size-base) break-all text-(--color-text-primary)'>
              {isReadOnly ? version?.title : t('version')}
            </p>
            {isReadOnly ? null : (
              <>
                <AutoGrowTextarea
                  className='w-full'
                  placeholder={t('versionTitlePlaceholder')}
                  value={localText.title}
                  onChange={onChangeTitle}
                />
              </>
            )}
            <NewOpinionTabFooter onNextClick={onNextClick} onCancel={onCancel} />
          </div>
        </Card>
      </div>
    </section>
  );
};
