import request from 'supertest';
import { createApp } from '../../src/app.mjs';
export function createHttp(deps) {
  const app = createApp(deps),
    agent = request.agent(app);
  return {
    agent,
    app,
    get: (path, status = 200) => agent.get(`/api/v1${path}`).expect(status),
    async mutate(method, path, body = {}, status = 200) {
      const session = await agent.get('/api/v1/auth/session').expect(200);
      const req = agent[method](`/api/v1${path}`)
        .set('Origin', deps.config.appOrigin)
        .set('X-CSRF-Token', session.body.csrfToken)
        .send(body);
      return status === null ? req : req.expect(status);
    },
  };
}
