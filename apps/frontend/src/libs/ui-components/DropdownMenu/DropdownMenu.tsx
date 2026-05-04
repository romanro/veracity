import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import classnames from 'classnames';
import type { TDropdownMenuOption, TDropdownMenuProps } from './DropdownMenu.models';
import styles from './DropdownMenu.module.scss';

export function DropdownMenu<T>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: TDropdownMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isDisabled = options?.length < 1;

  const selectedOption: TDropdownMenuOption<T> | undefined = options.find((o) => o.id == value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={classnames('relative min-w-64', className)} ref={wrapperRef}>
      <button
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        className={classnames('flex w-full items-center justify-between gap-2 focus:outline-none', styles.btn)}
      >
        <span className='flex items-center gap-2 truncate text-gray-900'>
          {selectedOption ? selectedOption.label : <>{placeholder}</>}
        </span>
        <ChevronDown className='h-4 w-4 text-gray-900' />
      </button>

      {open && (
        <ul className='absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white text-sm shadow-md'>
          {options?.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className='flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-indigo-50'
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
