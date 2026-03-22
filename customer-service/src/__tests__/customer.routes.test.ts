import request from 'supertest';
import app from '../index';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

// Mock Customer Model
jest.mock('../models/Customer');

describe('Customer Routes Integration', () => {
  const mockId = new mongoose.Types.ObjectId().toString();

  it('GET /customers should return all customers', async () => {
    const mockCustomers = [{ _id: mockId, name: 'John', email: 'j@test.com' }];
    (Customer.find as jest.Mock).mockResolvedValue(mockCustomers);

    const res = await request(app).get('/customers');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('POST /customers should create a customer', async () => {
    const mockCustomer = { _id: mockId, name: 'John', email: 'j@test.com' };
    (Customer.prototype.save as jest.Mock) = jest.fn().mockResolvedValue(mockCustomer);

    const res = await request(app)
      .post('/customers')
      .send({ name: 'John', email: 'j@test.com', phone: '123' });
      
    expect(res.status).toBe(201);
  });
});
