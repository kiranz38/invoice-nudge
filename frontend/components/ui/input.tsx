import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          'mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] sm:text-sm',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
    </div>
  );
});
Input.displayName = 'Input';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] sm:text-sm',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps & { children?: React.ReactNode }>(
  ({ label, error, helperText, className, children, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <select
          ref={ref}
          className={clsx(
            'mt-1 block w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#5c7cfa] sm:text-sm',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Input, Textarea, Select };