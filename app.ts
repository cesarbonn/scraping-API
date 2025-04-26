import dotenv from 'dotenv';
import Server from './models/server';
import cronjob from './utils/cronjob';
import { Application } from 'express';

dotenv.config();

console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);

const serverInitializer = new Server();

const app: Application = serverInitializer.getApp();

export default app;

if (require.main === module) {

    serverInitializer.listen();
    cronjob();
}