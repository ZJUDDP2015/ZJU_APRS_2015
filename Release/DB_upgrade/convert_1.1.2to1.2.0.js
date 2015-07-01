var mysql = require('mysql');

var sql = mysql.createConnection(require("../DBconfig.json"));
var cmd;
var yy = 2015;

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});
sql.query("use aprs");
sql.query("ALTER TABLE weather ADD Source VARCHAR(12)", function(err) {});
sql.query("ALTER TABLE weather ADD SymbolCode CHAR(1)", function(err) {});
sql.query("ALTER TABLE weather ADD Time DATETIME", function(err) {});
console.log('Converting started, please wait!')
cmd = "update weather set SymbolCode = '_', Source = substring(Path, 3, locate('" + '"' + "', Path, 3) - 3), Time = concat('2015-', cast(Month as char), '-', cast(Day as char), ' ', cast(Hour as char), ':', cast(Min as char),':', cast(Sec as char)) where Month >= 1 and Month <= 12 and Day >= 1 and Day <= 31 and Hour >=0 and Hour <=23 and Min >=0 and Min <= 60 and Sec >= 0 and Sec <= 60";
console.log(cmd);
sql.query(cmd, 
    function(err, row) {
        console.log("Converting finished.")
        process.exit()
    })

