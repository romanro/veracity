import { Card } from '@libs/ui-components/Card';
import { type FC } from 'react';
import { type TNewOpinionTopicVersionCardProps } from './NewOpinionTopicVersionCard.models';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';
import { NewOpinionTopicVersionCardFooter } from './NewOpinionTopicVersionCardFooter';

const ErrorMessage = dynamic(() => import('./ErrorMessage').then((mod) => mod.ErrorMessage), {
  ssr: false,
  loading: () => <ShimmerPlaceholder height={200} width='100%' />,
});

export const NewOpinionTopicVersionCard: FC<TNewOpinionTopicVersionCardProps> = ({
  topic,
  version,
  onPublish,
  onCancel,
  isTreeValid = false,
  isPublishing = false,
}) => {
  const { t } = useTranslation('newOpinionPage');

  if (!topic?.title || !version?.title) return <ErrorMessage />;

  return (
    <Card className='flex flex-col gap-[16px] !p-[16px]'>
      <section className='flex flex-col text-(length:--font-size-base)'>
        <div className='flex flex-row gap-4 p-2 items-center'>
          <h3 className='min-w-[4rem]  font-(--font-weight-medium) break-all text-(--color-text-secondary)'>{t('inTheme')}</h3>
          <h2 className='break-all text-(--color-text-primary)'>{topic.title}</h2>
        </div>
        <div className='flex flex-row gap-4 p-2 items-center'>
          <h3 className='min-w-[4rem] font-(--font-weight-medium) break-all text-(--color-text-secondary)'>
          {t('createOpinionOnVersion')}
        </h3>
          <h2 className='break-all text-(--color-text-primary)'>{version.title}</h2>
        </div>


      </section>
      <NewOpinionTopicVersionCardFooter
        isPublishDisabled={!isTreeValid || isPublishing}
        onPublish={onPublish}
        onCancel={onCancel}
        isPublishing={isPublishing}
      />
    </Card>
  );
};
