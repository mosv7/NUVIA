import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { API_PREFIX } from '@nuvia/shared-types';
import { authRoutes } from './modules/auth/routes.mjs';
import { workspaceRoutes } from './modules/workspaces/routes.mjs';
import { randomUUID } from 'node:crypto';
import { ApiError, errorHandler } from './middleware/errors.mjs';

export function createApp(dependencies) {
  const { config, db } = dependencies;
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.use(helmet());
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('X-Request-ID', req.requestId).set('Cache-Control', 'no-store');
    next();
  });
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());
  app.use(`${API_PREFIX}/auth`, authRoutes(dependencies));
  app.get(`${API_PREFIX}/health/live`, (_req, res) => res.json({ status: 'live' }));
  app.get(`${API_PREFIX}/health/ready`, async (_req, res) => {
    try {
      await db.command({ ping: 1 }, { timeoutMS: 3000 });
      res.json({ status: 'ready' });
    } catch {
      throw new ApiError(503, 'SERVICE_UNAVAILABLE');
    }
  });
  app.use(API_PREFIX, workspaceRoutes(dependencies));
  app.use((_req, _res, next) => next(new ApiError(404, 'NOT_FOUND')));
  app.use(errorHandler);
  return app;
}
