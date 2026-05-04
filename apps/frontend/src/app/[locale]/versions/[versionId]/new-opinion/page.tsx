import NewOpinionPage, {
  type TNewOpinionPageProps,
  generateMetadata as originalGenerateMetadata,
} from '../../../topics/[topicId]/versions/[versionId]/new-opinion/page';

export const generateMetadata = originalGenerateMetadata;

export default async function NewOpinionProxyPage({ ...params }: TNewOpinionPageProps) {
  return <NewOpinionPage {...params} />;
}
