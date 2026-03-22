import mongoose from 'mongoose';
import Order from '../models/Order';

describe('Order Model Unit Tests', () => {
  const validCustomerId = new mongoose.Types.ObjectId();
  const validProductId = new mongoose.Types.ObjectId();

  it('should validate a correct order', async () => {
    const order = new Order({
      customerId: validCustomerId,
      products: [{ productId: validProductId, quantity: 2, price: 100 }],
      totalAmount: 200,
      status: 'pending'
    });
    
    const err = order.validateSync();
    expect(err).toBeUndefined();
  });

  it('should fail if missing customerId', async () => {
    const order = new Order({
      products: [{ productId: validProductId, quantity: 2, price: 100 }],
      totalAmount: 200
    });
    
    const err = order.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['customerId']).toBeDefined();
  });

  it('should fail if product quantity is 0', async () => {
    const order = new Order({
      customerId: validCustomerId,
      products: [{ productId: validProductId, quantity: 0, price: 100 }],
      totalAmount: 100
    });
    
    const err = order.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['products.0.quantity']).toBeDefined();
  });
});
