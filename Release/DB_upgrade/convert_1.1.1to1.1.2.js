var mysql = require('mysql');

var sql = mysql.createConnection(require("../DBconfig.json"));
var cmd;

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});
sql.query("use aprs");
sql.query("CREATE TABLE `raw_data` (Source varchar(30),Time datetime,Data varchar(500),PRIMARY KEY (Source,Time));", function(err) {process.exit();});
