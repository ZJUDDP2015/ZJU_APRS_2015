var mysql = require('mysql');

var sql = mysql.createConnection(require("../DBconfig.json"));
var cmd;

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});
sql.query("use aprs");
sql.query("ALTER TABLE `user` CHANGE `password` `password` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;", function(err) {});
