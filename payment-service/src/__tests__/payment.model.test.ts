import mongoose from 'mongoose';
import Payment from '../models/Payment';

describe('Payment Model Unit Tests', () => {
  const validOrderId = new mongoose.Types.ObjectId();

  it('should validate a correct payment', async () => {
    const payment = new Payment({
      orderId: validOrderId,
      amount: 450.00,
      method: 'credit_card',
      status: 'pending'
    });
    
    const err = payment.validateSync();
    expect(err).toBeUndefined();
  });

  it('should fail if invalid payment method enum', async () => {
    const payment = new Payment({
      orderId: validOrderId,
      amount: 100,
      method: 'bitcoin' // invalid enum
    });
    
    const err = payment.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['method']).toBeDefined();
  });
});
