import { type Metadata } from 'next';
import { initServerI18n } from '@/i18n/serverInit';
import { TopicApi } from '@core/api/apis/Topic.api';
import { generateConsensusPageMeta } from '@core/utils/meta/consensusPageMeta.utils';
import { VersionsApi } from '@core/api/apis/Version.api';
import { getQueryClient } from '@core/providers/ReactQueryProvider/ReactQueryProvider.utils';
import { type TTopic } from '@core/models/Topic.model';
import { dehydrate } from '@tanstack/react-query';
import { TopicTitle } from '@widgets/PageWidgets/TopicPageWidgets/TopicTitle/TopicTitle';
import { CONTAINER_LG_CLASSES } from '@/app/styles/tailwind/container.consts';
import { ConsensusPageContainer } from '@widgets/PageWidgets/ConsensusPageWidgets/ConsensusPageContainer';

export type TConsensusPageParams = {
  locale: string;
  topicId?: string;
  versionId?: string;
};

export type TConsensusPageProps = {
  params: Promise<TConsensusPageParams>;
};

export async function generateMetadata({ params }: TConsensusPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, topicId, versionId } = resolvedParams;

  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'consensusPage');

  try {
    if (topicId) {
      const topic = await TopicApi.getById(topicId, { locale });
      const version = topic?.versions?.find((v) => v.id == versionId);
      return generateConsensusPageMeta({ t, topic, version });
    } else {
      const version = await VersionsApi.getById(versionId, { locale });
      return generateConsensusPageMeta({ t, topic: undefined, version });
    }
  } catch (_err) {
    return {
      title: 'Version not found',
    };
  }
}

export default async function ConsensusPage({ params }: TConsensusPageProps) {
  const { locale, topicId, versionId } = await params;

  let topic: TTopic | undefined;
  const queryClient = getQueryClient();

  if (topicId) {
    await queryClient.prefetchQuery({
      queryKey: ['topic', topicId, locale],
      queryFn: () => TopicApi.getById(topicId, { locale }),
    });

    topic = queryClient.getQueryData(['topic', topicId, locale]);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <section className={CONTAINER_LG_CLASSES}>
        <div className='flex justify-center'>
          {topic && (
            <TopicTitle
              title={topic?.title}
              locale={locale}
              topicId={topicId}
              versionsCount={topic?.versions?.length ?? 0}
              topicPositionCenter={true}
            />
          )}
        </div>

        <ConsensusPageContainer topicId={topicId} versionId={versionId} dehydratedState={dehydratedState} />
      </section>
    </main>
  );
}
