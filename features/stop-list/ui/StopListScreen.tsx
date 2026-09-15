'use client';

import { useQuery } from '@tanstack/react-query';
import { useMenuFilters } from '../model/filters';
import { menuQueries } from '../model/queries';

export function StopListScreen() {
  const { filters } = useMenuFilters();
  const { data, status } = useQuery(menuQueries.list(filters));

  if (status === 'pending') return <p>Загрузка…</p>;
  if (status === 'error') return <p>Ошибка</p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          {item.title} — {item.status.kind}
        </li>
      ))}
    </ul>
  );
}
