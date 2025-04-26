import request from 'supertest';
import app from '../app';


// Mocking the ExchangeRates model for testing purposes
jest.mock('../models/ExchangeRates', () => {
  // Create a mock object to simulate the ExchangeRates model
  const mockModel = {
    findOne: jest.fn().mockResolvedValue({
      currency: 'MOCKED_USD', // Test data for findOne
      rate: 70.99,
      date: '2025-01-01',

      toJSON: () => ({
        currency: 'MOCKED_USD',
        rate: 70.99,
        date: '2025-01-01',
      }),
    }),

    findAll: jest.fn().mockResolvedValue([ // <-- Returns an ARRAY of mocked objects
      {
        currency: 'MOCKED_USD', // Test data for findOne
        rate: 80.99,
        date: '2025-03-01',

        toJSON: () => ({
          currency: 'MOCKED_USD',
          rate: 80.99,
          date: '2025-03-01',
        }),
      },
      {
        currency: 'MOCKED_USD', // Test data for findOne
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

  return { __esModule: true, default: mockModel }; // Export the mock as the default
});

// ** --- End of Mocking Configuration --- **


// The tests
describe('API Endpoints Tests', () => {

  describe('GET /api/rates/current Endpoint', () => {

    it('should return 200 and current rate data (mocked)', async () => {

      // Perform the GET request to the COMPLETE route
      const response = await request(app).get('/api/rates/current');

      // **Assertions:**
      expect(response.status).toBe(200); // Verify that the status code is 200
      expect(response.headers['content-type']).toMatch(/json/); // Verify that the response is JSON

      // Verify that the response body is an object (as your controller expects for /current)
      expect(response.body).toBeInstanceOf(Object);

      // Verify the properties you expect in the response
      expect(response.body).toHaveProperty('currency');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('rate');

      // Verify the basic types
      expect(typeof response.body.currency).toBe('string');;
      expect(typeof response.body.rate).toBe('number');

    });
  });

  // ** --- Test for /api/rates/history --- **
  describe('GET /api/rates/history Endpoint', () => {

    it('should return 200 and rate history data (mocked)', async () => {

      const response = await request(app).get('/api/rates/history'); // Request without query params

      expect(response.status).toBe(200); // Verify the status code
      expect(response.headers['content-type']).toMatch(/json/); // Verify that the response is JSON

      // **Assertions for history:**

      expect(response.body).toBeInstanceOf(Object); // <-- Expect the response body to be an Object

      if (Array.isArray(response.body) && response.body.length > 0) {
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0]).toHaveProperty('currency');
        expect(response.body[0]).toHaveProperty('rate');
        expect(response.body[0]).toHaveProperty('date');
      }
    });
  });
});