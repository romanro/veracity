import { describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';

const buildTestApp = async () => {
  const env = loadEnv({ NODE_ENV: 'test' });
  return buildApp({ env });
};

describe('backend smoke', () => {
  it('rejects invalid env', () => {
    expect(() => loadEnv({ PORT: 'not-a-number' })).toThrow(/PORT/);
  });

  it('GET /api/v1/health/live returns 200', async () => {
    const app = await buildTestApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/health/live' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  it('GET /api/v1/health/ready returns 200', async () => {
    const app = await buildTestApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/health/ready' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  it('GET /api/v1/version returns version metadata', async () => {
    const app = await buildTestApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/version' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      version: 'dev',
      commit: null,
      nodeEnv: 'test',
    });
    await app.close();
  });
});
