'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo } from 'react';
import { Spinner } from '@/shared/ui/Spinner';
import { useMenuFilters } from '../model/filters';
import { menuQueries } from '../model/queries';
import { useStopListUiStore } from '../model/ui-store';
import { usePendingItemIds, useResumeItem } from '../model/use-stop-item';
import { Filters } from './Filters';
import { EmptyState, ErrorState, TableSkeleton } from './states';
import { StopListTable } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';

export function StopListScreen() {
  const { filters, updateFilters, resetFilters } = useMenuFilters();
  const { data, error, isPending, isFetching, refetch } = useQuery(menuQueries.list(filters));
  const pendingStopIds = usePendingItemIds('stop');
  const pendingResumeIds = usePendingItemIds('resume');
  const { mutate: resumeItem } = useResumeItem();

  const selectedItemId = useStopListUiStore((state) => state.selectedItemId);
  const openPanel = useStopListUiStore((state) => state.openPanel);
  const closePanel = useStopListUiStore((state) => state.closePanel);

  const handleResume = useCallback((itemId: string) => resumeItem({ id: itemId }), [resumeItem]);
  const selectedItem = useMemo(
    () => data?.find((item) => item.id === selectedItemId),
    [data, selectedItemId],
  );

  const isRefreshing = isFetching && !isPending;
  const contentState = isPending ? 'loading' : !data ? 'error' : data.length ? 'table' : 'empty';

  return (
    <>
      <div inert={Boolean(selectedItem)} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Filters shop={filters.shop} status={filters.status} onChange={updateFilters} />
          <AnimatePresence>
            {isRefreshing && (
              <motion.p
                role="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-10 items-center gap-2 text-sm text-muted"
              >
                <Spinner className="size-3.5" />
                Обновляем…
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={contentState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {contentState === 'loading' && <TableSkeleton />}
            {contentState === 'error' && (
              <ErrorState
                message={error?.message ?? 'Попробуйте ещё раз.'}
                onRetry={() => void refetch()}
              />
            )}
            {contentState === 'empty' && (
              <EmptyState
                canReset={Boolean(filters.shop || filters.status)}
                onReset={resetFilters}
              />
            )}
            {contentState === 'table' && data && (
              <StopListTable
                items={data}
                pendingStopIds={pendingStopIds}
                pendingResumeIds={pendingResumeIds}
                onStop={openPanel}
                onResume={handleResume}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <StopReasonPanel key={selectedItem.id} item={selectedItem} onClose={closePanel} />
        )}
      </AnimatePresence>
    </>
  );
}
