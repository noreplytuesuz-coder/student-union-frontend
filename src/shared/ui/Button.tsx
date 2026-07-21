import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/shared/lib/utils';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: "bg-gradient-hero text-white neo-shadow neo-border hover:shadow-lg hover:shadow-primary/40",
      secondary: "bg-transparent neo-border hover:bg-black/5 dark:hover:bg-white/5",
      ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
      danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white neo-shadow neo-border",
      outline: "neo-border border-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-4 text-lg font-bold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ translateY: -4 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
