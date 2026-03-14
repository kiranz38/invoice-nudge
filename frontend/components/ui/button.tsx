import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, children, ...rest }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md transition-colors';
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base',
    }[size];
    const variantClasses = {
      primary: 'bg-brand hover:bg-brand/90 text-white',
      secondary: 'bg-white/10 hover:bg-white/15 text-brand',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'bg-transparent hover:bg-white/5 text-brand',
    }[variant];
    const loadingClasses = loading ? 'opacity-70 pointer-events-none' : '';

    return (
      <button
        ref={ref}
        className={clsx(baseClasses, sizeClasses, variantClasses, loadingClasses, fullWidth && 'w-full')}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V4a8 8 0 018 8h-2a8 8 0 00-8 8v2a8 8 0 01-8-8z"
            ></path>
          </svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

export default Button;