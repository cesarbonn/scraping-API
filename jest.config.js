/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest', 
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.ts', // Busca archivos .ts en directorios __tests__
      '**/?(*.)+(spec|test).ts' // Busca archivos .spec.ts o .test.ts
    ],
     // Ignora directorios como node_modules y el directorio de compilación
    modulePathIgnorePatterns: [
        '<rootDir>/dist/' // Este path tiene que coincidir con tu salida de compilación
    ],
  };