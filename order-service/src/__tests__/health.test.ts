import request from 'supertest';
import app from '../index';

describe('Order Service Health API', () => {
  it('should return 200 OK with status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('Order Service');
  });
});
