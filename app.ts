import dotenv from 'dotenv';
import Server from './models/server';
import cronjob from './utils/cronjob';
import { Application } from 'express';

// Load environment variables from .env
dotenv.config();

console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS); // intermediate certificate necessary to validate the chain when connecting to www.bcv.org.ve.

// We create an instance of your Server class.
const serverInitializer = new Server();

const app: Application = serverInitializer.getApp();

export default app;

// **KEY PART FOR TESTING!**
// This code block only executes if this file (app.ts, compiled to JS)
// is the main script executed with `node`.
// It will NOT execute when the file is imported by your tests.
if (require.main === module) {

    serverInitializer.listen();
    // Execute the cronjob. Consider if the cronjob should also run in tests
    // or if it is only for the production environment.
    cronjob();
}