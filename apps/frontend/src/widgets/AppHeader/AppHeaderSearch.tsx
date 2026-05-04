'use client';

import { RoundedInputField } from '@libs/ui-components/form-controls/RoundedInputField';
import type { FC } from 'react';
import Link from 'next/link';

export const AppHeaderSearch: FC<{ locale: string; placeholder?: string }> = ({ locale, placeholder = 'Search' }) => {
  return (
    <Link href={`/${locale}/search`} className=''>
      <RoundedInputField variant="secondary" placeholder={placeholder} className='block' />
    </Link>
  );
};
