import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { stopItemPayloadSchema } from '@/entities/menu/schema';
import { stopMenuItem } from '@/server/menu-store';
import { delay, MUTATION_DELAY_MS, MUTATION_FAILURE_RATE, shouldFail } from '@/server/mock';
import { errorResponse, serverErrorResponse, storeErrorResponse } from '@/server/responses';

export async function POST(request: NextRequest, ctx: RouteContext<'/api/menu-items/[id]/stop'>) {
  const { id } = await ctx.params;
  const body: unknown = await request.json().catch(() => null);

  await delay(MUTATION_DELAY_MS);

  const parsed = stopItemPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, {
      code: 'validation_error',
      message: 'Проверьте причину и срок стопа',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  if (shouldFail(MUTATION_FAILURE_RATE)) {
    return serverErrorResponse('Не удалось поставить позицию в стоп-лист');
  }

  const result = stopMenuItem(id, parsed.data);
  return result.ok ? NextResponse.json(result.item) : storeErrorResponse(result.error);
}
