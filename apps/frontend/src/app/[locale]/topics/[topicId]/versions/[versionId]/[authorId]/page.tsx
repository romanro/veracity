type TAuthorOpinionPageProps = {
  params: Promise<{ locale: string; topicId: string; versionId: string; authorId: string }>;
};

export default async function AuthorOpinionPage({ params }: TAuthorOpinionPageProps) {
  const { topicId, versionId, authorId } = await params;
  return (
    <main className='flex-center'>
      Topic: {topicId}, Version: {versionId}, Author: {authorId}
    </main>
  );
}
