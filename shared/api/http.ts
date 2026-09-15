import type { z } from 'zod';
import { apiErrorBodySchema } from './contract';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options: { status: number; code: string; fieldErrors?: Record<string, string[]> },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }
}

export async function request<T>(
  url: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) headers.set('content-type', 'application/json');

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError('Нет соединения с сервером', { status: 0, code: 'network_error' });
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = apiErrorBodySchema.safeParse(body);
    if (parsed.success) {
      const { message, ...details } = parsed.data.error;
      throw new ApiError(message, { status: response.status, ...details });
    }
    throw new ApiError(`Ошибка сервера (${response.status})`, {
      status: response.status,
      code: 'unknown_error',
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError('Некорректный ответ сервера', {
      status: response.status,
      code: 'invalid_response',
    });
  }

  return parsed.data;
}
