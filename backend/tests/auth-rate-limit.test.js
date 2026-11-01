const { test } = require('node:test');
const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../app');

test('registration, password login and second-factor login share the authentication request budget', async () => {
  // Invalid bodies fail validation before any model/provider call. No database is used.
  await request(app).post('/api/auth/register').send({}).expect(400);
  for (let attempt = 0; attempt < 48; attempt++) {
    await request(app).post('/api/auth/login').send({}).expect(400);
  }
  await request(app).post('/api/auth/login/2fa').send({}).expect(400);
  await request(app).post('/api/auth/register').send({}).expect(429);
});
