import { clsx } from 'clsx';
import type { ComponentProps } from 'react';

type BadgeTone = 'neutral' | 'accent' | 'success';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-ink/5 text-muted',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
};

interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
