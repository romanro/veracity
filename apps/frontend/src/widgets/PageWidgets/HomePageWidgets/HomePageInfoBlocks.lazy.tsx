'use client';

import dynamic from 'next/dynamic';
import { HomePageInfoBlocksSkeleton } from './HomePageInfoBlocksSkeleton';

export const HomePageInfoBlocksLazy = dynamic(
  () => import('./HomePageInfoBlocks').then((mod) => mod.HomePageInfoBlocks),
  {
    ssr: false,
    loading: () => <HomePageInfoBlocksSkeleton />,
  }
);
