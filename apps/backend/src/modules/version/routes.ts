import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import type { Env } from '../../config/env.js';

const VersionResponse = z.object({
  version: z.string(),
  commit: z.string().nullable(),
  nodeEnv: z.enum(['development', 'test', 'production']),
});

export interface VersionRoutesOptions {
  env: Env;
}

export const versionRoutes = (
  { env }: VersionRoutesOptions,
): FastifyPluginAsyncZod => (app) => {
  app.get(
    '/version',
    {
      schema: {
        response: { 200: VersionResponse },
      },
    },
    () => ({
      version: env.BUILD_VERSION ?? 'dev',
      commit: env.BUILD_COMMIT ?? null,
      nodeEnv: env.NODE_ENV,
    }),
  );

  return Promise.resolve();
};
