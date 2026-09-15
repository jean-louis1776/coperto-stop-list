import { queryOptions } from '@tanstack/react-query';
import type { MenuFilters } from '@/entities/menu/types';
import { fetchMenuItems } from '../api/menu-api';

export const menuKeys = {
  all: ['menu-items'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
  mutations: () => [...menuKeys.all, 'mutation'] as const,
  mutation: (action: 'stop' | 'resume') => [...menuKeys.mutations(), action] as const,
};

export const menuQueries = {
  list: (filters: MenuFilters) =>
    queryOptions({
      queryKey: menuKeys.list(filters),
      queryFn: ({ signal }) => fetchMenuItems(filters, signal),
      retry: false,
    }),
};
