import React from 'react';

export type TDropdownMenuOption<T = string> = {
  value: T;
  label: React.ReactNode;
  id: string | number;
};

export type TDropdownMenuProps<T = string> = {
  options: TDropdownMenuOption<T>[];
  value?: TDropdownMenuOption<T>['id'] | null;
  onChange: (option: TDropdownMenuOption<T>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};
