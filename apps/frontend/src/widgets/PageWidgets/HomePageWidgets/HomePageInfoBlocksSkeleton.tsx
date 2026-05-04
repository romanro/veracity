

import { type FC } from 'react';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

const SKELETON_CARD_COUNT = 3;

export const HomePageInfoBlocksSkeleton: FC = () => (
  <section className="w-full px-4 py-8">
    <div className="flex-center overflow-hidden">
      <ul className="flex gap-4 overflow-x-auto pb-2 lg:mx-auto lg:grid lg:max-w-[1024px] lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:justify-center lg:gap-4 lg:overflow-x-visible lg:px-4 lg:py-8">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <li
            key={index}
            className="max-w-[320px] min-w-[280px] shrink-0 lg:mx-auto lg:w-full lg:min-w-0"
          >
            <ShimmerPlaceholder
              width="100%"
              height={280}
              className="rounded-lg"
            />
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-4 flex justify-center">
      <ShimmerPlaceholder width={140} height={40} className="rounded-lg" />
    </div>
  </section>
);
