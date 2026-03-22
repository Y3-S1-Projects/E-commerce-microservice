import request from 'supertest';
import app from '../index';
import Product from '../models/Product';
import mongoose from 'mongoose';

// Mock Product Model
jest.mock('../models/Product');

describe('Product Routes Integration', () => {
  const mockId = new mongoose.Types.ObjectId().toString();

  it('GET /products should return all products', async () => {
    const mockProducts = [{ _id: mockId, name: 'Test', price: 100 }];
    (Product.find as jest.Mock).mockResolvedValue(mockProducts);

    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Test');
  });

  it('GET /products/:id should return 404 if not found', async () => {
    (Product.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(/products/ + mockId);
    expect(res.status).toBe(404);
  });
});
