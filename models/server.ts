import express, { Application } from 'express';
import router from '../routes/rate';
import cors from 'cors';
import db from '../database/connection';
import { Server as HttpServer } from 'http';


class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        rates: '/api/rates'
    }

    private serverInstance: HttpServer | null;


    constructor() {

        this.app = express();
        this.port = process.env.PORT || '8000';
        this.serverInstance = null;

        //metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }


    async dbConnection() {

        if (process.env.NODE_ENV === 'test') {
            console.log('dbConnection method skipped in test environment');
            return;
        }
        try {

            await db.authenticate();
            console.log('Database online');

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }

    middlewares() {

        this.app.use(cors())
        this.app.use(express.json());
    }

    routes() {

        this.app.use(this.apiPaths.rates, router);
    }


    //DB connection and synchronization
    async listen() {
        try {

            await db.authenticate();
            console.log('Database online');

            await db.sync();
            console.log("Database models synchronized (tables created/updated).");

            this.app.listen(this.port, () => {
                console.log('Server running on port ' + this.port);
            });

        } catch (error) {
            console.error('Unable to connect to the database or synchronize models:', error);
            process.exit(1);
        }
    }

    getApp(): Application {
        return this.app;
    }

    close(done?: (err?: Error | undefined) => void): void {
        if (this.serverInstance) {
            console.log('Closing server');
            this.serverInstance.close(done);
        } else if (done) {
            done();
        }
    }
}

export default Server;