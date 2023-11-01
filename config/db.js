const mariadb = require('mariadb');
const dotenv = require('dotenv').config();

let pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
})

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
    
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connection');
        }
    
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }   

        if (err.code === 'ER_GET_CONNECTION_TIMEOUT') {
            console.error('Database connection failed');
        }  
    }

    if (conn) conn.release();

    return;
})

module.exports = pool;