require('dotenv').config();

const connection = async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    return await mysql.createConnection({host:'localhost', user: 'root', database: 'emptracker_db', password: 'Gramshammer856!'})
    // query database
     }



module.exports = connection
