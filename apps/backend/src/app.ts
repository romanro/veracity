import Fastify, { type FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import type { Env } from './config/env.js';
import { healthRoutes } from './modules/health/routes.js';
import { versionRoutes } from './modules/version/routes.js';

export interface BuildAppOptions {
  env: Env;
}

export const buildApp = async ({ env }: BuildAppOptions): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      ...(env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : {}),
    },
    disableRequestLogging: env.NODE_ENV === 'test',
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(healthRoutes, { prefix: '/api/v1/health' });
  await app.register(versionRoutes({ env }), { prefix: '/api/v1' });

  return app;
};
