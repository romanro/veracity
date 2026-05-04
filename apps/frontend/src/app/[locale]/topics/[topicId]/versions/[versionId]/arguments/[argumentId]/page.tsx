import { CONTAINER_LG_CLASSES } from '@/app/styles/tailwind/container.consts';
import { ArgumentApi } from '@core/api/apis/Argument.api';
import { TopicApi } from '@core/api/apis/Topic.api';
import { VersionsApi } from '@core/api/apis/Version.api';
import { generateArgumentPageMeta } from '@core/utils/meta/argumentPageMeta.utils';
import { initServerI18n } from '@/i18n/serverInit';
import { Argument } from '@widgets/PageWidgets/ArgumentPageWidgets/Argument';
import { TopicVersionTitle } from '@widgets/PageWidgets/ArgumentPageWidgets/TopicVersionTitle';
import { dehydrate } from '@tanstack/react-query';
import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import { getTopicVersionArgument } from '@/core/api/apis/utils/getTopicVersionArgument';

type TArgumentPageProps = {
  params: Promise<{ locale: string; topicId?: string; versionId?: string; argumentId: string }>;
};

export async function generateMetadata({ params }: TArgumentPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, topicId, versionId, argumentId } = resolvedParams;

  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'argumentPage');

  try {
    let argument = undefined;
    let topic = undefined;
    let version = undefined;

    if (argumentId) {
      argument = await ArgumentApi.getById(argumentId, { locale });
    }

    if (topicId) {
      topic = await TopicApi.getById(topicId, { locale });
      version = topic?.versions?.find((v) => v.id == versionId);
    }

    if (versionId && !topicId) {
      version = await VersionsApi.getById(versionId);
    }

    return generateArgumentPageMeta({ t, topic, version, argument });
  } catch (_err) {
    return {
      title: 'Argument not found',
    };
  }
}

const ArgumentPageContainer = dynamic(
  () =>
    import('@/widgets/PageWidgets/ArgumentPageWidgets/ArgumentPageContainer/ArgumentPageContainer').then(
      (mod) => mod.ArgumentPageContainer
    ),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={320} />,
  }
);

export default async function ArgumentPage({ params }: TArgumentPageProps) {
  const { topicId, versionId, argumentId, locale } = await params;

  const { topicData, versionData, argumentData, queryClient } = await getTopicVersionArgument({
    topicId,
    versionId,
    argumentId,
    locale,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className='flex-center'>
      <section className={CONTAINER_LG_CLASSES}>
        <TopicVersionTitle
          topicTitle={topicData?.title}
          versionTitle={versionData?.title}
          locale={locale}
          topicId={topicId}
          versionId={versionId}
        />
        <Argument hasTopic={Boolean(topicData?.title || versionData?.title)} argument={argumentData} locale={locale} />
        <ArgumentPageContainer
          dehydratedState={dehydratedState}
          mainParams={{
            argumentId: argumentId,
            topicId: topicId as string,
            versionId: versionId as string,
          }}
        />
      </section>
    </main>
  );
}
