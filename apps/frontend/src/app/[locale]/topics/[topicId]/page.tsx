import { TopicApi } from '@/core/api/apis/Topic.api';
import { type Metadata } from 'next';
import { generateTopicPageMeta } from '@/core/utils/meta/topicPageMeta.utils';
import { initServerI18n } from '@/i18n/serverInit';
import { getQueryClient } from '@core/providers/ReactQueryProvider/ReactQueryProvider.utils';
import { dehydrate } from '@tanstack/react-query';
import { TopicTitle } from '@/widgets/PageWidgets/TopicPageWidgets/TopicTitle/TopicTitle';
import type { TTopic } from '@/core/models/Topic.model';
import { CONTAINER_LG_CLASSES } from '@/app/styles/tailwind/container.consts';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';
import dynamic from 'next/dynamic';
import { type TLocale } from '@/i18n/i18n.models';

type TTopicPageProps = {
  params: Promise<{ locale: TLocale; topicId: string }>;
};

const TopicPageContainer = dynamic(
  () => import('@widgets/PageWidgets/TopicPageWidgets/TopicPageContainer').then((mod) => mod.TopicPageContainer),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={320} />,
  }
);

// 👇 SSR metadata
export async function generateMetadata({ params }: TTopicPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, topicId } = resolvedParams;

  const i18n = await initServerI18n(locale);
  const _t = i18n.getFixedT(locale, 'mainPage');

  try {
    const res = await TopicApi.getById(topicId, { locale });
    const topic = res;

    return generateTopicPageMeta({ topic, locale, route: `/topics/${topicId}` });
  } catch (_err) {
    return {
      title: 'Topic not found',
    };
  }
}

export default async function TopicPage({ params }: TTopicPageProps) {
  const { topicId, locale } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['topic', topicId, locale],
    queryFn: () => TopicApi.getById(topicId, { locale }),
  });

  const topic: TTopic | undefined = queryClient.getQueryData(['topic', topicId, locale]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <main>
      <section className={CONTAINER_LG_CLASSES}>
        {topic ? (
          <>
            <div className='flex justify-center'>
              <TopicTitle title={topic?.title} versionsCount={topic?.versions?.length ?? 0} />
            </div>
            <TopicPageContainer topicId={topicId} dehydratedState={dehydratedState} />
          </>
        ) : null}
      </section>
    </main>
  );
}
