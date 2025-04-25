// src/__tests__/server.test.ts

import request from 'supertest';
import app from '../app'; // <--- Importa la instancia de tu app

// ... (otros describe blocks o imports si los tienes)

describe('Basic Supertest Check', () => {

  // Este test verifica que Supertest puede hacer una petición a tu app
  it('GET /health should return 200 OK', async () => {
    // Usa request(app) para apuntar a tu aplicación y hacer una petición GET a /health
    const response = await request(app).get('/health');

    // Solo verificamos el estado 200 para la prueba básica de Supertest
    expect(response.status).toBe(200);

    // Verifica el cuerpo si añadiste el { status: 'ok' }
    expect(response.body).toEqual({ status: 'ok' });
     // Verifica también el Content-Type
    expect(response.headers['content-type']).toMatch(/json/);
  });

  // ... (otros tests para /api/rates, etc.)

});