"use strict";
// src/app.ts (Este es tu archivo principal para iniciar el servidor)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server")); // Importa tu clase Server
const cronjob_1 = __importDefault(require("./utils/cronjob")); // Importa tu cronjob si lo usas
// Carga las variables de entorno desde .env
dotenv_1.default.config();
console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);
// Creamos una instancia de tu clase Server.
// Esto ejecuta el constructor, que configura Express, conecta a la DB, etc.
const serverInitializer = new server_1.default();
// Obtenemos la instancia de la aplicación (Express app) desde la instancia de Server.
// Gracias al método getApp() que añadimos.
const app = serverInitializer.getApp();
// **¡PARTE CLAVE PARA TESTING! Exporta la instancia de la aplicación.**
// Tus archivos de test importarán 'app' desde aquí.
exports.default = app;
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
    (0, cronjob_1.default)();
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
//# sourceMappingURL=app.js.map