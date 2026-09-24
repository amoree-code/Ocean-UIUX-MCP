'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

import {
  useIsInView,
  type UseIsInViewOptions,
} from '@/hooks/use-is-in-view';

type HighlightTextProps = Omit<HTMLMotionProps<'span'>, 'children'> & {
  text: string;
  delay?: number;
} & UseIsInViewOptions;

function HighlightText({
  ref,
  text,
  style,
  className,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  transition = { duration: 2, ease: 'easeInOut' },
  delay = 0,
  ...props
}: HighlightTextProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLElement>,
    {
      inView,
      inViewOnce,
      inViewMargin,
    },
  );

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      // bg-left/rtl:bg-right (not an inline style): background-position has no logical
      // keyword, so the sweep must start from the visual start of the text's own direction.
      className={`bg-left rtl:bg-right ${className ?? ''}`}
      initial={{ backgroundSize: '0% 100%' }}
      animate={isInView ? { backgroundSize: '100% 100%' } : undefined}
      transition={{
        ...transition,
        delay: (transition?.delay ?? 0) + delay / 1000,
      }}
      style={{
        position: 'relative',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
        ...style,
      }}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
