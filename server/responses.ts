import 'server-only';
import { NextResponse } from 'next/server';
import type { ApiErrorBody } from '@/shared/api/contract';
import type { MenuStoreError } from './menu-store';

export function errorResponse(
  status: number,
  body: ApiErrorBody['error'],
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: body }, { status });
}

const STORE_ERRORS: Record<MenuStoreError, { status: number; message: string }> = {
  not_found: { status: 404, message: 'Позиция не найдена' },
  not_stopped: { status: 409, message: 'Позиция уже в продаже' },
  out_of_stock: { status: 422, message: 'Нельзя вернуть в продажу: остаток 0' },
};

export function storeErrorResponse(code: MenuStoreError): NextResponse<ApiErrorBody> {
  const { status, message } = STORE_ERRORS[code];
  return errorResponse(status, { code, message });
}

export function serverErrorResponse(message: string): NextResponse<ApiErrorBody> {
  return errorResponse(500, { code: 'server_error', message });
}
