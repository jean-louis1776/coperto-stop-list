import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { menuFiltersSchema } from '@/entities/menu/schema';
import { menuKeys } from '@/features/stop-list/model/queries';
import { StopListScreen } from '@/features/stop-list/ui/StopListScreen';
import { listMenuItems } from '@/server/menu-store';

export default async function Page({ searchParams }: PageProps<'/'>) {
  const filters = menuFiltersSchema.parse(await searchParams);
  const queryClient = new QueryClient();
  queryClient.setQueryData(menuKeys.list(filters), listMenuItems(filters));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Стоп-лист</h1>
        <p className="mt-1 text-muted">Позиции меню текущей смены</p>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <StopListScreen />
      </HydrationBoundary>
    </main>
  );
}
