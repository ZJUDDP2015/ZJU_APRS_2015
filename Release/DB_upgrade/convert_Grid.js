var mysql = require('mysql');

var sql = mysql.createConnection(require("../DBconfig.json"));
var cmd;

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});
sql.query("use aprs");
sql.query("ALTER TABLE moving_object ADD Grid_latitude INT", function(err) {});
sql.query("ALTER TABLE moving_object ADD Grid_longitude INT", function(err) {});
sql.query("ALTER TABLE `moving_object` ADD INDEX(`Grid_latitude`)", function(err) {});
sql.query("ALTER TABLE `moving_object` ADD INDEX(`Grid_longitude`)", function(err) {});
console.log('Computing Gird started, please wait!')
sql.query("update moving_object set Grid_latitude = floor((`Latitude`+90)/0.1) ," +
    "Grid_longitude = floor((`Longitude`+180)/0.1) " +
    "where Latitude >=-90 and Latitude <=90 and Longitude>=-180 and Longitude<=180", 
    function(err, row) {
        console.log("Computing Gird finished.")
        process.exit()
    })
/*
sql.query("select id,Latitude,Longitude from moving_object where Latitude is not null and Longitude is not null", function(err, row) {
    if (typeof(row) != 'undefined'){
        var count = 0;
        var tot = row.length;
        var lng_len = 0.1;
        var lat_len = 0.1;
        row.forEach(function(e) {
            var Grid_lat = Math.floor((e.Latitude+90)/lat_len);
            var Grid_lng = Math.floor((e.Longitude+180)/lng_len);
            var query = 'update moving_object set Grid_latitude = "'+Grid_lat+'",Grid_longitude = "'+Grid_lng+'" where id ='+e.id;
            sql.query(query, function(err, res) {
                count++;
                console.log("Computing Grid:"+"Current: " + count + '/' + "Total: " + tot);
                if (count == tot){
                    console.log("Computing Gird finished. you can exit command line now.");
                }
            });
        })
    }
})*/
