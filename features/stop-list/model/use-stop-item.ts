import {
  useMutation,
  useMutationState,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type { MenuItem, MenuItemStatus, StopItemPayload } from '@/entities/menu/types';
import { resumeMenuItem, stopMenuItem } from '../api/menu-api';
import { menuKeys } from './queries';

interface ItemVariables {
  id: string;
}

interface StopItemVariables extends ItemVariables {
  payload: StopItemPayload;
}

function updateItemInLists(
  queryClient: QueryClient,
  id: string,
  update: (item: MenuItem) => MenuItem,
) {
  queryClient.setQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() }, (items) =>
    items?.map((item) => (item.id === id ? update(item) : item)),
  );
}

function findCachedItem(queryClient: QueryClient, id: string): MenuItem | undefined {
  return queryClient
    .getQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() })
    .flatMap(([, items]) => items ?? [])
    .find((item) => item.id === id);
}

function useOptimisticItemMutation<TVariables extends ItemVariables>(
  action: 'stop' | 'resume',
  mutationFn: (variables: TVariables) => Promise<MenuItem>,
  getOptimisticStatus: (variables: TVariables) => MenuItemStatus,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: menuKeys.mutation(action),
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.lists() });
      const previous = findCachedItem(queryClient, variables.id);
      updateItemInLists(queryClient, variables.id, (item) => ({
        ...item,
        status: getOptimisticStatus(variables),
      }));
      return { previous };
    },
    onError: (_error, variables, context) => {
      const previous = context?.previous;
      if (previous) updateItemInLists(queryClient, variables.id, () => previous);
    },
    onSuccess: (item) => {
      updateItemInLists(queryClient, item.id, () => item);
    },
    onSettled: async () => {
      if (queryClient.isMutating({ mutationKey: menuKeys.mutations() }) === 1) {
        await queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      }
    },
  });
}

export function useStopItem() {
  return useOptimisticItemMutation(
    'stop',
    ({ id, payload }: StopItemVariables) => stopMenuItem(id, payload),
    ({ payload }) => ({ kind: 'stopped', ...payload }),
  );
}

export function useResumeItem() {
  return useOptimisticItemMutation(
    'resume',
    ({ id }: ItemVariables) => resumeMenuItem(id),
    () => ({ kind: 'available' }),
  );
}

function getItemId(variables: unknown): string | undefined {
  return typeof variables === 'object' &&
    variables !== null &&
    'id' in variables &&
    typeof variables.id === 'string'
    ? variables.id
    : undefined;
}

export function usePendingItemIds(): ReadonlySet<string> {
  const ids = useMutationState({
    filters: { mutationKey: menuKeys.mutations(), status: 'pending' },
    select: (mutation) => getItemId(mutation.state.variables),
  });

  return useMemo(() => new Set(ids.filter((id) => id !== undefined)), [ids]);
}
