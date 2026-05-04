'use client';

import { SignIn } from '@clerk/nextjs';

export default function Sign() {
  return (
    <div className='mt-8 flex justify-center'>
      <SignIn />
    </div>
  );
}
