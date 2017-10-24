var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ecommerce_site',
    port: 3306
});


module.exports = {
    connection
}

