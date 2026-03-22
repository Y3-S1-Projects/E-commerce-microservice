import Customer from '../models/Customer';

describe('Customer Model Unit Tests', () => {
  it('should validate a correct customer', async () => {
    const customer = new Customer({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890'
    });
    
    const err = customer.validateSync();
    expect(err).toBeUndefined();
  });

  it('should fail if email is missing', async () => {
    const customer = new Customer({
      name: 'John Doe',
      phone: '1234567890'
    });
    
    const err = customer.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['email']).toBeDefined();
  });
});
