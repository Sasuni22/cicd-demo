const request = require('supertest');
const app = require('../app');

describe('Health Endpoint', () => {
  it('returns a status object', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('Items Endpoint', () => {
  it('POST without name returns 400', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ description: 'no name given' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 on unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});