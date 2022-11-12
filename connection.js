const mysql= require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'trackem_db'

});

module.exports= db;