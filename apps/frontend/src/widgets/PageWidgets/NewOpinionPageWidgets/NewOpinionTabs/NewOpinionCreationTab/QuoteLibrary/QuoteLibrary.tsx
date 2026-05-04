import { Tabs } from '@libs/ui-components/Tabs';
import { QuoteSearch } from './QuoteSearch/QuoteSearch';
import { useTabSelection } from '@libs/hooks/useTabSelection/useTabSelection';
import type { TTab } from '@libs/ui-components/Tabs/Tabs.models';
import { QuoteArgumentsList } from './QuoteArgumentsList/QuoteArgumentsList';
import { useMemo, useState, type FC } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGetProfile } from '@core/api/hooks/useGetProfile';
import type { TArgument } from '@core/models/Argument.model';
import { getQUERY_LIBRARY_TABS } from './QuoteLibrary.utils';

type TQuoteLibraryProps = {
  usedArguments?: TArgument[];
  onArgumentReuse?: (argument: TArgument, buttonElement: HTMLButtonElement) => void;
};

export const QuoteLibrary: FC<TQuoteLibraryProps> = ({ usedArguments = [], onArgumentReuse }) => {
  const [search, setSearch] = useState<string | null>(null);
  const { t } = useTranslation('newOpinionPage');
  const QUERY_LIBRARY_TABS = useMemo(() => getQUERY_LIBRARY_TABS(t), [t]);

  const { selected, onTabSelected, tabs } = useTabSelection<TTab>(QUERY_LIBRARY_TABS);
  const { data: user } = useGetProfile();
  const { topicId } = useParams();

  const onSearch = (str: string) => {
    setSearch(str);
  };

  return (
    <>
      <div className="shrink-0 px-2 mb-2">
        <QuoteSearch onSearch={onSearch} />
      </div>
      <div className="shrink-0 px-2 mb-4">
        <Tabs tabs={tabs} onTabSelected={onTabSelected} initiallySelected={selected} />
      </div>
      <div className='overflow-hidden'>
        <QuoteArgumentsList
          search={search}
          id={selected}
          topicId={topicId as string}
          userId={user?.id}
          usedArguments={usedArguments}
          onArgumentReuse={onArgumentReuse}
        />
      </div>
    </>
  );
};
