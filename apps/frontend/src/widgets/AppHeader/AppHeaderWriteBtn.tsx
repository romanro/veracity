'use client';
import { useUser } from '@clerk/nextjs';
import { useLocaleRouter } from '@libs/hooks/useLocaleRouter';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import Link from 'next/link';
import type { FC } from 'react';

export const AppHeaderWriteBtn: FC<{ label?: string }> = ({ label = 'Write' }) => {
  const { user } = useUser();
  const { getLocalizedPath } = useLocaleRouter();

  return (
    <Link href={!user ? '/sign' : getLocalizedPath('/new-opinion')}>
      <RoundedButton className='w-[140px]' variant='secondary'>
        {label}
      </RoundedButton>
    </Link>
  );
};
