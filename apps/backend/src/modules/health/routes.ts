import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const HealthResponse = z.object({
  status: z.literal('ok'),
});

export const healthRoutes: FastifyPluginAsyncZod = (app) => {
  app.get(
    '/live',
    {
      schema: {
        response: { 200: HealthResponse },
      },
    },
    () => ({ status: 'ok' as const }),
  );

  app.get(
    '/ready',
    {
      schema: {
        response: { 200: HealthResponse },
      },
    },
    () => ({ status: 'ok' as const }),
  );

  return Promise.resolve();
};
