'use client';
import { memo, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TArgument } from '@core/models/Argument.model';
import type { IAnimationPosition } from '../NewOpinionCreationTab.types';
import { CardArgumentSearch } from '@/widgets/Arguments/CardArgumentSearch';
import { ANIMATION_CONFIG } from '../NewOpinionCreationTab.constants';

interface IAnimationOverlayProps {
  animatingArgument: TArgument | null;
  animationStartPos: IAnimationPosition | null;
}

export const AnimationOverlay: FC<IAnimationOverlayProps> = memo(({ animatingArgument, animationStartPos }) => (
  <AnimatePresence mode='wait'>
    {animatingArgument && animationStartPos && (
      <div className='pointer-events-none fixed inset-0 z-[9999]'>
        <motion.div
          key={`animation-${animatingArgument.id}`}
          className='absolute'
          initial={{
            left: animationStartPos.x - ANIMATION_CONFIG.initialOffset.x,
            top: animationStartPos.y - ANIMATION_CONFIG.initialOffset.y,
            scale: ANIMATION_CONFIG.scale.initial,
            opacity: ANIMATION_CONFIG.opacity.initial,
          }}
          animate={{
            left: Math.min((typeof window !== 'undefined' ? window.innerWidth : 0) * ANIMATION_CONFIG.target.leftFactor, ANIMATION_CONFIG.target.leftMax),
            top: (typeof window !== 'undefined' ? window.innerHeight : 0) * ANIMATION_CONFIG.target.topFactor,
            scale: ANIMATION_CONFIG.scale.animate,
            opacity: ANIMATION_CONFIG.opacity.animate,
          }}
          exit={{
            opacity: ANIMATION_CONFIG.opacity.exit,
            scale: ANIMATION_CONFIG.scale.exit,
          }}
          transition={ANIMATION_CONFIG.motion}
          style={{
            width: `${ANIMATION_CONFIG.card.width}px`,
            willChange: 'transform',
          }}
        >
          <div className={`rotate-${ANIMATION_CONFIG.card.rotation} transform overflow-hidden rounded-lg border-2 border-emerald-300 bg-white shadow-2xl ring-4 ring-emerald-100`}>
            <CardArgumentSearch item={animatingArgument} newArgument={true} onContextMenu={false} />
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

AnimationOverlay.displayName = 'AnimationOverlay';
