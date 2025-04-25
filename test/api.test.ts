// src/__tests__/server.test.ts

import request from 'supertest';
import app from '../app'; // Asegúrate de que este path sea correcto

// ... (otros describe blocks como Basic Jest Setup, Basic Supertest Check)

// Describe un grupo de tests para tu endpoint /api/rates/current
describe('GET /api/rates/current Endpoint', () => {

  // Test para verificar que el endpoint responde con 200 OK
  // Asumimos que este endpoint no requiere parámetros en la URL o cuerpo para un caso básico
  it('should return 200 and current rate data', async () => {

    // Realiza la petición GET a la ruta COMPLETA
    const response = await request(app).get('/api/rates/current');

    // **Aserciones:**
    // 1. Verifica que el código de estado sea 200 (OK)
    expect(response.status).toBe(200);

    // 2. Verifica que la respuesta sea JSON (asumiendo que devuelve JSON)
    expect(response.headers['content-type']).toMatch(/json/);

    // 3. Verifica que el cuerpo de la respuesta NO esté vacío
    // expect(response.body).toBeDefined(); // Verifica que hay un cuerpo
    // expect(response.body).not.toBeNull(); // Y que no es null

    // 4. (Opcional) Si sabes la ESTRUCTURA mínima de la respuesta, verifícala.
    // Por ejemplo, si siempre devuelve un objeto con una propiedad 'rate' y 'timestamp':
    // expect(response.body).toBeInstanceOf(Object);
    // expect(response.body).toHaveProperty('rate');
    // expect(response.body).toHaveProperty('timestamp');
    // expect(typeof response.body.rate).toBe('number'); // Si la tasa es un número

  });

  // Puedes añadir más tests aquí, dependiendo de si /current necesita query params,
  // si puede dar errores específicos (ej. si la DB está caída, aunque ya mockeamos la conexión)
  // it('should return 400 if a required query parameter is missing', async () => { ... });

});