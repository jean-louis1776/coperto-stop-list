import { NextResponse, type NextRequest } from 'next/server';
import { menuFiltersSchema } from '@/entities/menu/schema';
import { listMenuItems } from '@/server/menu-store';
import { delay, LIST_DELAY_MS, LIST_FAILURE_RATE, shouldFail } from '@/server/mock';
import { serverErrorResponse } from '@/server/responses';

export async function GET(request: NextRequest) {
  const filters = menuFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams));

  await delay(LIST_DELAY_MS);
  if (shouldFail(LIST_FAILURE_RATE)) {
    return serverErrorResponse('Сервер не ответил. Попробуйте ещё раз.');
  }

  return NextResponse.json(listMenuItems(filters));
}
