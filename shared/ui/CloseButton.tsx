import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { focusRing } from './styles';

interface CloseButtonProps extends ComponentProps<'button'> {
  label: string;
}

export function CloseButton({ label, className, ...props }: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={clsx(
        '-m-1 rounded-md p-1 text-muted transition-colors hover:text-ink',
        focusRing,
        className,
      )}
      {...props}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="size-4">
        <path
          d="m5 5 10 10M15 5 5 15"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
