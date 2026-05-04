import NewOpinionPage, {
  type TNewOpinionPageProps,
  generateMetadata as originalGenerateMetadata,
} from '../versions/[versionId]/new-opinion/page';

export const generateMetadata = originalGenerateMetadata;

export default async function NewOpinionProxyPage({ ...params }: TNewOpinionPageProps) {
  return <NewOpinionPage {...params} />;
}
