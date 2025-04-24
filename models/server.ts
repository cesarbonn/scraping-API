import express, {Application} from 'express';
import router from '../routes/rate';
import cors from 'cors';
import db from '../database/connection';

class Server{

    private app :   Application;
    private port:   string;
    private apiPaths = {
        rates: '/api/rates'
    }

    constructor(){

        this.app   = express();
        this.port  = process.env.PORT || '8000';

        //metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection(){

        try {

            await db.authenticate();
            console.log('Database online');
             
        }catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));            
        }
    }
    


    middlewares(){
        this.app.use(cors())
        this.app.use(express.json());
       
    }

    routes(){
        this.app.use(this.apiPaths.rates, router);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}

export default Server;



