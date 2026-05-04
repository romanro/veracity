import { TopicApi } from '@/core/api/apis/Topic.api';
import { getTopicVersionArgument } from '@/core/api/apis/utils/getTopicVersionArgument';
import { VersionsApi } from '@/core/api/apis/Version.api';
import { generateNewOpinionPageMeta } from '@/core/utils/meta/newOpinionPageMeta.utils';
import { initServerI18n } from '@/i18n/serverInit';
import { ShimmerPlaceholder } from '@/libs/ui-components/ShimmerPlaceholder';
import { dehydrate } from '@tanstack/react-query';
import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';

export type TNewOpinionPageProps = {
  params: Promise<{ locale: string; topicId: string; versionId: string }>;
};

export async function generateMetadata({ params }: TNewOpinionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, topicId, versionId } = resolvedParams;

  const i18n = await initServerI18n(locale);
  const t = i18n.getFixedT(locale, 'consensusPage');

  try {
    if (topicId) {
      const topic = await TopicApi.getById(topicId);
      const version = topic?.versions?.find((v) => v.id == versionId);
      return generateNewOpinionPageMeta({ t, topic, version });
    } else {
      const version = await VersionsApi.getById(versionId);
      return generateNewOpinionPageMeta({ t, topic: undefined, version });
    }
  } catch (_err) {
    return {
      title: 'New Opinion',
    };
  }
}

const NewOpinionPageContainer = dynamic(
  () =>
    import('@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionPageContainer/NewOpinionPageContainer').then(
      (mod) => mod.NewOpinionPageContainer
    ),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={320} />,
  }
);

export default async function NewOpinionPage({ params }: TNewOpinionPageProps) {
  const { topicId, versionId, locale } = await params;

  const { queryClient } = await getTopicVersionArgument({
    topicId,
    versionId,
    locale,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className={`flex-center overflow-hidden ${styles.main}`}>
      <NewOpinionPageContainer dehydratedState={dehydratedState} mainParams={{ topicId, versionId, locale }} />
    </main>
  );
}
