// src/app.ts (Este es tu archivo principal para iniciar el servidor)

import dotenv from 'dotenv';
import Server from './models/server'; // Importa tu clase Server
import cronjob from './utils/cronjob'; // Importa tu cronjob si lo usas
import { Application } from 'express'; // Importa el tipo Application de express si usas TypeScript

// Carga las variables de entorno desde .env
dotenv.config();

console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);

// Creamos una instancia de tu clase Server.
// Esto ejecuta el constructor, que configura Express, conecta a la DB, etc.
const serverInitializer = new Server();

// Obtenemos la instancia de la aplicación (Express app) desde la instancia de Server.
// Gracias al método getApp() que añadimos.
const app: Application = serverInitializer.getApp();

// **¡PARTE CLAVE PARA TESTING! Exporta la instancia de la aplicación.**
// Tus archivos de test importarán 'app' desde aquí.
export default app;

// **¡PARTE CLAVE PARA TESTING!**
// Este bloque de código solo se ejecuta si este archivo (app.ts, compilado a JS)
// es el script principal que se ejecuta con `node`.
// NO se ejecutará cuando el archivo sea importado por tus tests.
if (require.main === module) {
    console.log('Ejecutando como script principal. Iniciando servidor y cronjob...');

    // Inicia el servidor escuchando en el puerto.
    // Usamos la misma instancia 'serverInitializer' que creamos arriba.
    serverInitializer.listen();

    // Ejecuta el cronjob. Considera si el cronjob debe correr también en tests
    // o si solo es para el entorno de producción.
    cronjob();
}

// Opcional: Si necesitas cerrar la conexión a la DB u otros recursos
// cuando el proceso termine (solo en ejecución principal), puedes agregar listeners:
/*
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down');
    serverInitializer.close(() => { // Usamos el método close que añadiste a Server
        // Lógica para cerrar conexión a DB si es necesario y no se cierra con server.close
        // db.close();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
     console.log('SIGINT received, shutting down');
     serverInitializer.close(() => { // Usamos el método close que añadiste a Server
        // db.close();
        process.exit(0);
     });
});
*/
