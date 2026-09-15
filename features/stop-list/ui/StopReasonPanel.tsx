import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SHOP_LABELS, STOP_REASON_LABELS } from '@/entities/menu/labels';
import { STOP_REASONS, stopItemPayloadSchema } from '@/entities/menu/schema';
import type { MenuItem, StopItemPayload } from '@/entities/menu/types';
import { Button } from '@/shared/ui/Button';
import { CloseButton } from '@/shared/ui/CloseButton';
import { Field } from '@/shared/ui/Field';
import { Select } from '@/shared/ui/Select';
import { getStopPayloadFieldErrors, useStopItem } from '../model/use-stop-item';
import { UntilField } from './UntilField';

const REASON_OPTIONS = STOP_REASONS.map((reason) => ({
  value: reason,
  label: STOP_REASON_LABELS[reason],
}));

interface StopReasonPanelProps {
  item: MenuItem;
  onClose: () => void;
}

export function StopReasonPanel({ item, onClose }: StopReasonPanelProps) {
  const titleId = useId();
  const [isEditing] = useState(item.status.kind === 'stopped');
  const { mutate: stopItem, isPending } = useStopItem();

  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<StopItemPayload>({
    resolver: zodResolver(stopItemPayloadSchema),
    mode: 'onBlur',
    defaultValues:
      item.status.kind === 'stopped'
        ? { reason: item.status.reason, until: item.status.until }
        : { until: null },
  });

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFocus('reason');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, setFocus]);

  const onSubmit = handleSubmit((payload) => {
    stopItem(
      { id: item.id, payload },
      {
        onSuccess: onClose,
        onError: (error) => {
          for (const { field, message } of getStopPayloadFieldErrors(error)) {
            setError(field, { message });
          }
        },
      },
    );
  });

  return (
    <div className="fixed inset-0 z-40">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/25"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl shadow-ink/20"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {isEditing ? 'Изменить стоп' : 'Поставить в стоп-лист'}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {item.title} · {SHOP_LABELS[item.shop]}
            </p>
          </div>
          <CloseButton label="Закрыть панель" onClick={onClose} />
        </header>

        <form noValidate onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
            <Field label="Причина" error={errors.reason?.message}>
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  {...register('reason')}
                  invalid={Boolean(errors.reason)}
                  options={REASON_OPTIONS}
                  placeholder="Выберите причину"
                />
              )}
            </Field>
            <Controller
              control={control}
              name="until"
              render={({ field, fieldState }) => (
                <UntilField
                  value={field.value}
                  error={fieldState.error?.message}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <footer className="flex justify-end gap-2 border-t border-line px-6 py-4">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isPending} loadingText="Сохраняем…">
              {isEditing ? 'Сохранить' : 'Поставить в стоп'}
            </Button>
          </footer>
        </form>
      </motion.aside>
    </div>
  );
}
