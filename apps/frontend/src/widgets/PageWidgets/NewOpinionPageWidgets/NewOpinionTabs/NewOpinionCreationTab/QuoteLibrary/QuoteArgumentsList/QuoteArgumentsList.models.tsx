import type { TArgumentTabsGetParams } from '../../../../../ArgumentPageWidgets/ArgumentTabs/ArgumentTabs.models';
import type { TArgument } from '@core/models/Argument.model';

export type TQuoteArgumentsListProps = {
  search?: string | null;
  usedArguments?: TArgument[];
  onArgumentReuse?: (argument: TArgument, buttonElement: HTMLButtonElement) => void;
} & TArgumentTabsGetParams;
