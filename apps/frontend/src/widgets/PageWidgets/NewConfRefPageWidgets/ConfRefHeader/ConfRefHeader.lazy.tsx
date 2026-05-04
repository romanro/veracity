import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

export const ConfRefHeader = dynamic(
  () =>
    import(
      /* webpackPreload: true */ '@widgets/PageWidgets/NewConfRefPageWidgets/ConfRefHeader/ConfRefHeader'
    ).then((mod) => mod.ConfRefHeader),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={220} className='w-full' />,
  }
);
