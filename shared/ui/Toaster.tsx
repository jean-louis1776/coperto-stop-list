'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useToastStore } from '@/shared/model/toast-store';
import { CloseButton } from './CloseButton';

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <section
      aria-label="Уведомления"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            role="alert"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-danger/20 bg-surface p-4 shadow-lg shadow-ink/10"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-danger">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M10 6v4.5M10 13.5v.01"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <p className="flex-1 text-sm text-ink">{toast.message}</p>
            <CloseButton label="Закрыть уведомление" onClick={() => dismiss(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
