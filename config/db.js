import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

const { DB_HOST , DB_USER , DB_PASSWORD , DB_DATABASE} = process.env;

let config = {
    host : DB_HOST,
    user : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE,
    allowExitOnIdle : true
}

let pool = new Pool(config);

export {
    pool
}