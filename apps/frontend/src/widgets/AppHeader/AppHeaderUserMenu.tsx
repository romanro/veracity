'use client';

import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { type FC } from 'react';

const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: 'w-[32px] h-[32px]', // Custom width and height
    userButtonPopoverCard: 'bg-blue-100', // Custom background for the popover card
    userButtonPopoverActionButton: 'text-blue-600', // Custom text color for action buttons
  },
};

export const AppHeaderUserMenu: FC = () => {
  const { user, isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <div className='flex items-center gap-[8px]'>
          <span>{user.fullName}</span> <UserButton appearance={userButtonAppearance} />
        </div>
      ) : (
        <SignInButton>
          <RoundedButton>Sign In CyberPravda</RoundedButton>
        </SignInButton>
      )}
    </>
  );
};
