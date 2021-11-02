import * as dotenv from 'dotenv';

import mysql from 'mysql';

dotenv.config();
const DBConfig = process.env.MODE==="PRODUCT"
?{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
	database:process.env.DB
}
:{
    host:process.env.DB_DEV_HOST,
    user: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASSWORD,
	database:process.env.DB_DEV
}

const dbConnection = mysql.createConnection(DBConfig);

export default dbConnection;
