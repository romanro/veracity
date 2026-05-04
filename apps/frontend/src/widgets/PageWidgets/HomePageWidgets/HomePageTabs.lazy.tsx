'use client';

import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

export const Tabs = dynamic(() => import('@libs/ui-components/Tabs/Tabs').then((mod) => mod.Tabs), {
  ssr: true,
  loading: () => <ShimmerPlaceholder height={50} />,
});

export const TopicsList = dynamic(() => import('@/widgets/TopicsList/TopicsList').then((mod) => mod.TopicsList), {
  ssr: true,
  loading: () => <ShimmerPlaceholder height={300} />,
});

export const HomePageTabsLazy = dynamic(
  () => import('./HomePageTabs').then((mod) => mod.HomePageTabs),
  {
    ssr: false,
    loading: () => <ShimmerPlaceholder height={320} />,
  }
);
