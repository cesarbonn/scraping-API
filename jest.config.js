/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest', // Usa el preset de ts-jest para manejar TypeScript
    testEnvironment: 'node', // El entorno de pruebas es Node.js
    // Especifica dónde encontrar tus archivos de prueba
    testMatch: [
      '**/__tests__/**/*.ts', // Busca archivos .ts en directorios __tests__
      '**/?(*.)+(spec|test).ts' // Busca archivos .spec.ts o .test.ts
    ],
     // Ignora directorios como node_modules y el directorio de compilación
    modulePathIgnorePatterns: [
        '<rootDir>/dist/' // Asegúrate de que este path coincida con tu salida de compilación
    ],
    // Si necesitas configurar paths de módulos específicos (opcional)
    // moduleDirectories: ['node_modules', 'src'],
  };