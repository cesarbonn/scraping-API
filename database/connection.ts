import { Sequelize } from "sequelize";

// Create a new Sequelize instance to connect to the database
const db = new Sequelize('node' , 'admin' , '123456!@#$%^',{
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
    });

    export default db; 
