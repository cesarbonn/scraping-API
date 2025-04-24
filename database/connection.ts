import { Sequelize } from "sequelize";


const db = new Sequelize('node' , 'admin' , '123456!@#$%^',{
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
    });

    export default db; 
