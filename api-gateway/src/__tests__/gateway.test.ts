import request from 'supertest';
import app from '../index';

describe('API Gateway API Tests', () => {
  it('should return Directory on root /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('API Gateway');
    expect(res.body.availableServices).toBeDefined();
  });

  it('should return 200 OK on Health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});
