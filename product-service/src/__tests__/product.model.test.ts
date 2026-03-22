import Product from '../models/Product';

describe('Product Model Unit Tests', () => {
  it('should validate a correct product', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      stock: 10
    });
    
    const err = product.validateSync();
    expect(err).toBeUndefined();
  });

  it('should fail validation if name is missing', async () => {
    const product = new Product({
      description: 'Test Description',
      price: 100,
      category: 'Test Category'
    });
    
    const err = product.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['name']).toBeDefined();
  });

  it('should fail validation if price is negative', async () => {
    const product = new Product({
      name: 'Test',
      description: 'Test',
      price: -10,
      category: 'Test'
    });
    
    const err = product.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['price']).toBeDefined();
  });
});
