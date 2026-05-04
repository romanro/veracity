import { type InputHTMLAttributes } from 'react';

export type TSearchFieldProps = {
  initialValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  delay?: number;
  clearTextWithEnter?: boolean;
  showSearchIcon?: boolean;
  onChangeText?: (value: string) => void;
  isSaveArgument?: boolean;

  onSearch: (value: string) => void;
  showClearButton?: boolean;
  showFindButton?: boolean;
  submitOnType?: boolean;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  classNames?: {
    wrapper?: string;
    input?: string;
    clearButton?: string;
    findButton?: string;
    label?: string;
  };
};
