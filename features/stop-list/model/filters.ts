import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { menuFiltersSchema } from '@/entities/menu/schema';
import type { MenuFilters } from '@/entities/menu/types';
import { toSearchString } from '@/shared/lib/search-params';

function parseFilters(searchParams: URLSearchParams): MenuFilters {
  return menuFiltersSchema.parse(Object.fromEntries(searchParams));
}

export function useMenuFilters() {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateFilters = useCallback((patch: MenuFilters) => {
    const current = parseFilters(new URLSearchParams(window.location.search));
    const search = toSearchString({ ...current, ...patch });
    if (search === window.location.search) return;

    window.history.pushState(null, '', `${window.location.pathname}${search}`);
  }, []);

  const resetFilters = useCallback(
    () => updateFilters({ shop: undefined, status: undefined }),
    [updateFilters],
  );

  return { filters, updateFilters, resetFilters };
}
