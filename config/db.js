// config/db.js
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'srv1089.hstgr.io', 
    user: 'u782613999_marshaluser',
    password: 'Gaurav@2211', 
    database: 'u782613999_marshal',
    connectionLimit: 10,
});

db.on('error', (err) => {
    console.error('Database error', err);
});

module.exports = db;
