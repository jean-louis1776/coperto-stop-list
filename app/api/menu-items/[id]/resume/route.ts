import { NextResponse, type NextRequest } from 'next/server';
import { resumeMenuItem } from '@/server/menu-store';
import { delay, MUTATION_DELAY_MS, MUTATION_FAILURE_RATE, shouldFail } from '@/server/mock';
import { serverErrorResponse, storeErrorResponse } from '@/server/responses';

export async function POST(
  _request: NextRequest,
  ctx: RouteContext<'/api/menu-items/[id]/resume'>,
) {
  const { id } = await ctx.params;

  await delay(MUTATION_DELAY_MS);

  if (shouldFail(MUTATION_FAILURE_RATE)) {
    return serverErrorResponse('Не удалось вернуть позицию в продажу');
  }

  const result = resumeMenuItem(id);
  return result.ok ? NextResponse.json(result.item) : storeErrorResponse(result.error);
}
