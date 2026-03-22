import request from 'supertest';
import app from '../index';
import Order from '../models/Order';
import mongoose from 'mongoose';

// Mock Order Model
jest.mock('../models/Order');

describe('Order Routes Integration', () => {
  const mockId = new mongoose.Types.ObjectId().toString();

  it('GET /orders should return all orders', async () => {
    const mockOrders = [{ _id: mockId, customerId: 'c1', totalAmount: 200 }];
    (Order.find as jest.Mock).mockResolvedValue(mockOrders);

    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /orders/:id should return 404 if order not found', async () => {
    (Order.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(/orders/ + mockId);
    expect(res.status).toBe(404);
  });
});
