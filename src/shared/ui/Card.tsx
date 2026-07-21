import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/shared/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
  neo?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, neo = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden p-6",
          glass && "glass",
          neo && "neo-border neo-shadow",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
