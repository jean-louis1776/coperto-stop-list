import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MenuItem, MenuItemStatus, StopItemPayload } from '@/entities/menu/types';
import { stopMenuItem } from '../api/menu-api';
import { menuKeys } from './queries';
import { useStopItem } from './use-stop-item';

vi.mock('../api/menu-api', () => ({
  fetchMenuItems: vi.fn(),
  stopMenuItem: vi.fn(),
  resumeMenuItem: vi.fn(),
}));

const payload: StopItemPayload = { reason: 'equipment', until: null };
const stopped: MenuItemStatus = { kind: 'stopped', ...payload };
const available: MenuItemStatus = { kind: 'available' };

function createItem(id: string, overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id,
    title: id,
    shop: 'kitchen',
    stock: 5,
    status: available,
    updatedAt: '2026-09-14T10:00:00.000Z',
    ...overrides,
  };
}

function setup() {
  const queryClient = new QueryClient();
  const allKey = menuKeys.list({});
  const kitchenKey = menuKeys.list({ shop: 'kitchen' });
  queryClient.setQueryData(allKey, [createItem('a'), createItem('b')]);
  queryClient.setQueryData(kitchenKey, [createItem('a'), createItem('b')]);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const statusIn = (key: readonly unknown[], id: string) =>
    queryClient.getQueryData<MenuItem[]>(key)?.find((item) => item.id === id)?.status;

  return { wrapper, allKey, kitchenKey, statusIn };
}

afterEach(() => {
  vi.mocked(stopMenuItem).mockReset();
});

describe('useStopItem', () => {
  it('updates every cached list immediately and rolls back on error', async () => {
    const { wrapper, allKey, kitchenKey, statusIn } = setup();
    const response = Promise.withResolvers<MenuItem>();
    vi.mocked(stopMenuItem).mockReturnValueOnce(response.promise);
    const { result } = renderHook(() => useStopItem(), { wrapper });

    act(() => result.current.mutate({ id: 'a', payload }));

    await waitFor(() => expect(statusIn(allKey, 'a')).toEqual(stopped));
    expect(statusIn(kitchenKey, 'a')).toEqual(stopped);

    act(() => response.reject(new Error('Server error')));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(statusIn(allKey, 'a')).toEqual(available);
    expect(statusIn(kitchenKey, 'a')).toEqual(available);
  });

  it('keeps a concurrent optimistic update when another mutation fails', async () => {
    const { wrapper, allKey, statusIn } = setup();
    const failing = Promise.withResolvers<MenuItem>();
    const succeeding = Promise.withResolvers<MenuItem>();
    vi.mocked(stopMenuItem)
      .mockReturnValueOnce(failing.promise)
      .mockReturnValueOnce(succeeding.promise);
    const { result } = renderHook(() => ({ first: useStopItem(), second: useStopItem() }), {
      wrapper,
    });

    act(() => result.current.first.mutate({ id: 'a', payload }));
    act(() => result.current.second.mutate({ id: 'b', payload }));
    await waitFor(() => expect(statusIn(allKey, 'b')).toEqual(stopped));

    act(() => failing.reject(new Error('Server error')));

    await waitFor(() => expect(statusIn(allKey, 'a')).toEqual(available));
    expect(statusIn(allKey, 'b')).toEqual(stopped);

    act(() => succeeding.resolve(createItem('b', { status: stopped })));

    await waitFor(() => expect(result.current.second.isSuccess).toBe(true));
    expect(statusIn(allKey, 'b')).toEqual(stopped);
  });
});
