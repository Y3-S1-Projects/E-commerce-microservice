import request from 'supertest';
import app from '../index';
import Payment from '../models/Payment';
import mongoose from 'mongoose';

// Mock Payment Model
jest.mock('../models/Payment');

describe('Payment Routes Integration', () => {
  const mockId = new mongoose.Types.ObjectId().toString();

  it('GET /payments should return all payments', async () => {
    const mockPayments = [{ _id: mockId, orderId: 'o1', amount: 300, method: 'credit_card' }];
    (Payment.find as jest.Mock).mockResolvedValue(mockPayments);

    const res = await request(app).get('/payments');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /payments/:id should return 200 if found', async () => {
    const mockPayment = { _id: mockId, orderId: 'o1', amount: 300, method: 'credit_card' };
    (Payment.findById as jest.Mock).mockResolvedValue(mockPayment);

    const res = await request(app).get(/payments/ + mockId);
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(300);
  });
});
