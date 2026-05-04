import { memo, type FC } from 'react';
import type { TArgument } from '@core/models/Argument.model';
import { Card } from '@libs/ui-components/Card';
import { QuoteLibrary } from '../QuoteLibrary/QuoteLibrary';
import { ArgumentTitleRight } from '../../../../ArgumentPageWidgets/ArgumentTitleRight';

interface IQuoteLibraryColumnProps {
  usedArguments: TArgument[];
  onArgumentReuse: (argument: TArgument, buttonElement: HTMLButtonElement) => void;
}

export const QuoteLibraryColumn: FC<IQuoteLibraryColumnProps> = memo(({ usedArguments, onArgumentReuse }) => (

    <Card className="h-full flex flex-col overflow-hidden py-[15px]">
      <div className="min-h-0 p-2 w-full h-full overflow-auto pb-4">
        <ArgumentTitleRight />
        <QuoteLibrary usedArguments={usedArguments} onArgumentReuse={onArgumentReuse} />
      </div>
    </Card>

));

QuoteLibraryColumn.displayName = 'QuoteLibraryColumn';
