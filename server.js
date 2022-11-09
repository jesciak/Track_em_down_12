const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '8008',
    user: 'root',
    password: '',
    database: 'trackem_db'

});