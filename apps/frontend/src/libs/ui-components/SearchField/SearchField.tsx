import React from 'react';

import { type FC, useEffect, useState, type KeyboardEvent } from 'react';
import { type TSearchFieldProps } from './SearchField.models';
import { Search } from 'lucide-react';

import { RectButton } from '../Buttons/RectButton';
import { ClearButton } from '../Buttons/ClearButton';

import { useDebouncedValue } from '@libs/hooks/useDebouncedValue';

import classnames from 'classnames';
import styles from './SearchField.module.scss';

export const SearchField: FC<TSearchFieldProps> = ({
  initialValue = '',
  placeholder = 'Search...',
  buttonLabel = 'Find',
  clearTextWithEnter = false,
  delay = 500,
  onSearch,
  onChangeText,
  isSaveArgument,
  showClearButton = true,
  showFindButton = true,
  submitOnType = false,
  inputProps = {},
  classNames = {},
  showSearchIcon = false,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(inputValue, delay);

  useEffect(() => {
    setInputValue(initialValue ?? '');
  }, [initialValue]);

  useEffect(() => {
    if (isSaveArgument) {
      handleClear();
    }
  }, [isSaveArgument]);

  useEffect(() => {
    if (submitOnType) {
      onSearch(debouncedValue.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
      if (clearTextWithEnter) {
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueText = e.target.value;
    setInputValue(valueText);
    onChangeText?.(valueText);
  };

  const { wrapper, input, clearButton, findButton, label } = classNames;

  return (
    <div className={classnames(styles.wrapper, wrapper)}>
      <label className={classnames(styles.label, label)}>
        {showSearchIcon && <Search className={styles.searchIcon} />}
        <input
          type='text'
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={classnames(styles.input, showSearchIcon && styles.hasIcon, input)}
          {...inputProps}
        />
        {inputValue && showClearButton && (
          <ClearButton
            className={classnames(styles.clearButton, clearButton)}
            onClick={handleClear}
            aria-label='Clear'
          />
        )}
      </label>
      {showFindButton && (
        <RectButton className={classnames(styles.button, findButton)} onClick={handleSearch}>
          {buttonLabel}
        </RectButton>
      )}
    </div>
  );
};
