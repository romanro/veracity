import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import classnames from 'classnames';
import styles from './CompactSelect.module.scss';
import type { TDropdownMenuOption, TDropdownMenuProps } from '../DropdownMenu/DropdownMenu.models';
import classNames from 'classnames';

export function CompactSelect<T>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  disabled,
}: TDropdownMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const isDisabled = disabled || options?.length < 1;

  const selectedOption: TDropdownMenuOption<T> | undefined = options.find((o) => o.id == value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize highlighted index when dropdown opens
  useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex((o) => o.id == value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, options, value]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev + 1 >= options.length ? 0 : prev + 1;
            optionRefs.current[next]?.scrollIntoView({ block: 'nearest' });
            return next;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev - 1 < 0 ? options.length - 1 : prev - 1;
            optionRefs.current[next]?.scrollIntoView({ block: 'nearest' });
            return next;
          });
          break;

        case 'Enter':
          event.preventDefault();
          if (options[highlightedIndex]) {
            onChange(options[highlightedIndex]);
            setOpen(false);
          }
          break;

        case 'Escape':
          event.preventDefault();
          setOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, highlightedIndex, options, onChange]);

  return (
    <div className={classnames('relative min-w-64', className)} ref={wrapperRef}>
      <button
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        className={classnames('flex w-full items-center justify-between gap-2 focus:outline-none', styles.btn)}
      >
        <span className={styles.label}>{selectedOption ? selectedOption.label : <>{placeholder}</>}</span>
        <ChevronDown className='h-4 w-4 text-gray-800' />
      </button>

      {open && (
        <ul className={classNames('absolute z-10 !mt-2 w-full', styles.dropdown)}>
          {options?.map((option, index) => (
            <li
              key={index}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={classNames('flex cursor-pointer items-center gap-2', styles.option, {
                [styles.highlighted]: index === highlightedIndex,
              })}
            >
              {option.label}
              {option.id == value && <Check size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
