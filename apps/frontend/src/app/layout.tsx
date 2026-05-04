import React from 'react';
import './globals.scss';
import { RootProviders } from '@/core/providers/RootProviders';
import { inter } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`light ${inter.variable}`}>
      <body className='bg-[var(--color-bg-primary)]'>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
