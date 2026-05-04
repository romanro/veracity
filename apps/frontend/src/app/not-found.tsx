import Link from 'next/link';
import { AppLogo } from '@/libs/ui-components/AppLogo';
import { RoundedButton } from '@/libs/ui-components/Buttons/RoundedButton';

export default function NotFound() {
  return (
    <main className='flex h-screen flex-col items-center justify-center bg-white'>
      <div className='text-center'>
        <AppLogo logoText='CyberPravda' />
        <h1 className='mt-4 mb-4 text-2xl font-bold'>Page not found</h1>
        <p className='text-md mb-6 text-(--color-text-secondary)'>We couldn’t find what you were looking for.</p>
        <Link href='/' className='text-blue-600 underline hover:text-blue-800'>
          <RoundedButton>Go back home</RoundedButton>
        </Link>
      </div>
    </main>
  );
}
