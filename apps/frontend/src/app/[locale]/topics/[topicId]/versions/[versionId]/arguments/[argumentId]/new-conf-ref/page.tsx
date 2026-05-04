import { getTopicVersionArgument } from '@/core/api/apis/utils/getTopicVersionArgument';
import { NewConfRefContainer } from '@/widgets/PageWidgets/NewConfRefPageWidgets/NewConfRefContainer';
import { dehydrate } from '@tanstack/react-query';

type TNewConfRefPageProps = {
  params: Promise<{ locale: string; topicId: string; versionId: string; argumentId: string }>;
  searchParams: Promise<{ type: string }>;
};

export default async function NewConfRefPage({ params, searchParams }: TNewConfRefPageProps) {
  const { topicId, versionId, argumentId, locale } = await params;
  const { type } = await searchParams;

  const { topicData, versionData, argumentData, queryClient } = await getTopicVersionArgument({
    topicId,
    versionId,
    argumentId,
    locale,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className='flex-center max-h-[calc(100vh-var(--header-height))] overflow-hidden'>
      <section className='mx-auto max-h-[calc(100vh-var(--header-height))] w-full max-w-[1750px] overflow-hidden px-8'>
        <NewConfRefContainer
          dehydratedState={dehydratedState}
          mainParams={{ topicId, versionId, argumentId, locale }}
          type={type}
          topic={topicData}
          version={versionData}
          argument={argumentData}
        />
      </section>
    </main>
  );
}
