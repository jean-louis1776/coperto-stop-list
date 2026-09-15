import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useId } from 'react';
import { getUntilSlotRange, UNTIL_STEP_MS } from '@/entities/menu/schema';
import { dateTimeLocalToIso, isoToDateTimeLocal } from '@/shared/lib/datetime-local';
import { FieldError } from '@/shared/ui/Field';
import { controlBase, controlBorder, focusRing } from '@/shared/ui/styles';

interface UntilFieldProps {
  value: string | null;
  error?: string;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}

export function UntilField({ value, error, onChange, onBlur }: UntilFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const inputId = `${id}-input`;
  const hasExactTime = value !== null;
  const range = getUntilSlotRange();

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-ink">Срок</legend>
      <div className="grid grid-cols-2 gap-2">
        <ModeOption
          name={id}
          label="До конца смены"
          checked={!hasExactTime}
          onSelect={() => onChange(null)}
          onBlur={onBlur}
        />
        <ModeOption
          name={id}
          label="До времени"
          checked={hasExactTime}
          onSelect={() => onChange(new Date(range.min + UNTIL_STEP_MS).toISOString())}
          onBlur={onBlur}
        />
      </div>
      <AnimatePresence initial={false}>
        {hasExactTime && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="-m-1 overflow-hidden p-1"
          >
            <label htmlFor={inputId} className="sr-only">
              Время окончания стопа
            </label>
            <input
              id={inputId}
              type="datetime-local"
              step={UNTIL_STEP_MS / 1000}
              min={isoToDateTimeLocal(new Date(range.min).toISOString())}
              max={isoToDateTimeLocal(new Date(range.max).toISOString())}
              value={isoToDateTimeLocal(value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => onChange(dateTimeLocalToIso(event.target.value))}
              onBlur={onBlur}
              className={clsx(controlBase, controlBorder(Boolean(error)), focusRing, 'w-full')}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

interface ModeOptionProps {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
  onBlur: () => void;
}

function ModeOption({ name, label, checked, onSelect, onBlur }: ModeOptionProps) {
  return (
    <label
      className={clsx(
        'flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
        checked
          ? 'border-accent bg-accent/5 text-ink'
          : 'border-line bg-surface text-muted hover:border-muted/60',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        onBlur={onBlur}
        className="accent-accent outline-none"
      />
      {label}
    </label>
  );
}
