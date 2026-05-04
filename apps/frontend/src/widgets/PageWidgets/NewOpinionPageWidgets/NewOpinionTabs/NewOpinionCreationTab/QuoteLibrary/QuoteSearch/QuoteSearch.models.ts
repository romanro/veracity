import type { TSearchFieldProps } from '@libs/ui-components/SearchField/SearchField.models';

export type TQuoteSearchProps = Pick<TSearchFieldProps, 'onSearch' | 'initialValue'>;
