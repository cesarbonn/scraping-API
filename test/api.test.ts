import request from 'supertest';
import app from '../app';

// Mocking the ExchangeRates model for testing purposes
// Create a mock object to simulate the ExchangeRates model

jest.mock('../models/ExchangeRates', () => {
  const mockModel = {
    findOne: jest.fn().mockResolvedValue({
      currency: 'MOCKED_USD', 
      rate: 70.99,
      date: '2025-01-01',

      toJSON: () => ({
        currency: 'MOCKED_USD',
        rate: 70.99,
        date: '2025-01-01',
      }),
    }),

    findAll: jest.fn().mockResolvedValue([ 
      {
        currency: 'MOCKED_USD', 
        rate: 80.99,
        date: '2025-03-01',

        toJSON: () => ({
          currency: 'MOCKED_USD',
          rate: 80.99,
          date: '2025-03-01',
        }),
      },
      {
        currency: 'MOCKED_USD', 
        rate: 89.99,
        date: '2025-04-01',

        toJSON: () => ({
          currency: 'MOCKED_USD',
          rate: 89.99,
          date: '2025-04-01',
        }),
      },
    ]),

  };

  return { __esModule: true, default: mockModel }; 
});




// The tests verify that the status code is 200 and that the response is in JSON format.
describe('API Endpoints Tests', () => {

  describe('GET /api/rates/current Endpoint', () => {

    it('should return 200 and current rate data (mocked)', async () => {

      const response = await request(app).get('/api/rates/current');

    
      expect(response.status).toBe(200); 
      expect(response.headers['content-type']).toMatch(/json/);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('currency');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('rate');

      expect(typeof response.body.currency).toBe('string');;
      expect(typeof response.body.rate).toBe('number');

    });
  });

  
  describe('GET /api/rates/history Endpoint', () => {

    it('should return 200 and rate history data (mocked)', async () => {

      const response = await request(app).get('/api/rates/history'); 

      expect(response.status).toBe(200); 
      expect(response.headers['content-type']).toMatch(/json/); 

      expect(response.body).toBeInstanceOf(Object); 
      if (Array.isArray(response.body) && response.body.length > 0) {
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty('currency');
        expect(response.body[0]).toHaveProperty('rate');
        expect(response.body[0]).toHaveProperty('date');
      }
    });
  });
});