import dotenv from 'dotenv';
import Server from './models/server';
import cronjob from './utils/cronjob';
dotenv.config();





console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS); 

const server = new Server();

cronjob();

server.listen();
