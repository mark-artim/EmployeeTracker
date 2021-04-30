require('dotenv').config();

const connection = async function main() {
    // get the client
    const mysql = require('mysql2/promise');
    // create the connection
    return await mysql.createConnection({host:'localhost', user: '', database: 'emptracker_db', password: ''})
    // query database
     }



module.exports = connection
