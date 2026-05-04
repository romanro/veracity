import { SearchPageContainer } from '@/widgets/PageWidgets/SearchPageWidgets/SearchPageContainer';
import { type Metadata } from 'next';
import { CONTAINER_CLASSES } from '../../styles/tailwind/container.consts';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Search`;
  const keywords = ['search'];
  const description = 'search page';
  return {
    title,
    keywords,
    description,
  };
}

export default function SearchPage() {
  return (
    <main className='flex-center'>
      <section className={CONTAINER_CLASSES}>
        <h1 className='pageHeader'>Search</h1>
      </section>
      <SearchPageContainer />
    </main>
  );
}
