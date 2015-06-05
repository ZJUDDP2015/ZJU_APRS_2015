var mysql = require('mysql');

var sql = mysql.createConnection(require("./DBconfig.json"));
var cmd;

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});

sql.query("use aprs");
sql.query("alter table moving_object change Time temp varchar(40)", function(err) {});
sql.query("alter table moving_object add Time datetime", function(err) {});
sql.query("select id, temp from moving_object where temp is not null", function(err, row) {
    var count = 0;
    var tot = row.length;
    if (typeof(row) != 'undefined')
        row.forEach(function(e) {
            var s, month;
            var afterSplit = e.temp.split(' ');
            switch (afterSplit[2]) {
                case 'Jan':
                    month = '01';
                    break;
                case 'Feb':
                    month = '02';
                    break;
                case 'Mar':
                    month = '03';
                    break;
                case 'Apr':
                    month = '04';
                    break;
                case 'May':
                    month = '05';
                    break;
                case 'Jun':
                    month = '06';
                    break;
                case 'Jul':
                    month = '07';
                    break
                case 'Aug':
                    month = '08';
                    break;
                case 'Sep':
                    month = '09';
                    break;
                case 'Oct':
                    month = '10';
                    break;
                case 'Nov':
                    month = '11';
                    break;
                case 'Dec':
                    month = '12';
                    break;
            }
            s = afterSplit[3] + '-' + month + '-' + afterSplit[1] + ' ' + afterSplit[4];
            cmd = 'update moving_object set temp = NULL, Time = "' + s + '" where id =  ' + e.id;
            count++
            console.log("Current: " + count + '/' + "Total: " + tot);
            sql.query(cmd, function(err, res) {});
            if (count == tot)
                sql.query("alter table moving_object drop column temp")
        })
    else console.log('NAL');
})
