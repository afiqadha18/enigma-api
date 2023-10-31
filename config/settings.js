const dotenv = require('dotenv');

dotenv.config();

exports.dbConfig = {
    host: 'localhost', 
    database: 'ip_balcklist_db',
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
}
