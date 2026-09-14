import { z } from 'zod';

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
  }),
});

export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;
