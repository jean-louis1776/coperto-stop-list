import type { ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';

const SKELETON_ROWS = 6;

export function TableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Загрузка меню"
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
    >
      <div className="h-10 bg-canvas/50" />
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className="flex items-center gap-8 border-t border-line px-4 py-3">
          <div className="h-4 w-52 animate-pulse rounded bg-ink/10" />
          <div className="h-4 w-24 animate-pulse rounded bg-ink/10" />
          <div className="h-4 w-12 animate-pulse rounded bg-ink/10" />
          <div className="h-5 w-32 animate-pulse rounded-full bg-ink/10" />
          <div className="ml-auto h-8 w-40 animate-pulse rounded-lg bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

interface StateMessageProps {
  title: string;
  description: string;
  action?: ReactNode;
  role?: 'alert' | 'status';
}

function StateMessage({ title, description, action, role }: StateMessageProps) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-surface px-6 py-16 text-center"
    >
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StateMessage
      role="alert"
      title="Не удалось загрузить меню"
      description={message}
      action={
        <Button variant="secondary" onClick={onRetry}>
          Повторить
        </Button>
      }
    />
  );
}

interface EmptyStateProps {
  canReset: boolean;
  onReset: () => void;
}

export function EmptyState({ canReset, onReset }: EmptyStateProps) {
  return canReset ? (
    <StateMessage
      title="Ничего не найдено"
      description="По выбранным фильтрам позиций нет. Попробуйте изменить или сбросить фильтры."
      action={
        <Button variant="secondary" onClick={onReset}>
          Сбросить фильтры
        </Button>
      }
    />
  ) : (
    <StateMessage title="Меню пусто" description="В меню смены пока нет позиций." />
  );
}
