import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { controlBase, controlBorder, focusRing } from './styles';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends ComponentProps<'select'> {
  options: readonly SelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

export function Select({ options, placeholder, invalid, className, ...props }: SelectProps) {
  return (
    <div className={clsx('relative', className)}>
      <select
        aria-invalid={invalid || undefined}
        className={clsx(
          controlBase,
          controlBorder(invalid),
          focusRing,
          'w-full cursor-pointer appearance-none pr-9',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
      >
        <path
          d="m5 7.5 5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
