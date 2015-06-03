var mysql = require('mysql');

var sql = mysql.createConnection(require("../DBConfig.json"));

var saved = 0
var w_save_cnt = 0
var o_save_cnt = 0
var received = 0

sql.connect(function(err) {
    if (err)
        console.log('db connect error', err);
});


exports.weather = function(req, res) {
    //console.log(req.body)
    //console.log(req.body.data);
    ++received
    var insert = 'insert into weather (Type,Month,Day,Hour,Min,Sec,Lat,Longi,WindDirection,WindSpeed,WeatherUnit,Gust,Temp,RainLastHr,RainLast24Hr,RainSinceMid,Humidity,Barometric,Luminosity,Path) values(' +
        mysql.escape(req.body.Type) + ', ' +
        mysql.escape(req.body.Month) + ', ' +
        mysql.escape(req.body.Day) + ', ' +
        mysql.escape(req.body.Hour) + ', ' +
        mysql.escape(req.body.Min) + ', ' +
        mysql.escape(req.body.Sec) + ', ' +
        mysql.escape(req.body.Lat) + ', ' +
        mysql.escape(req.body.Longi) + ', ' +
        mysql.escape(req.body.WindDirection) + ', ' +
        mysql.escape(req.body.WindSpeed) + ', ' +
        mysql.escape(req.body.WeatherUnit) + ', ' +
        mysql.escape(req.body.Gust) + ', ' +
        mysql.escape(req.body.Temp) + ', ' +
        mysql.escape(req.body.RainLastHr) + ', ' +
        mysql.escape(req.body.RainLast24Hr) + ', ' +
        mysql.escape(req.body.RainSinceMid) + ', ' +
        mysql.escape(req.body.Humidity) + ', ' +
        mysql.escape(req.body.Barometric) + ', ' +
        mysql.escape(req.body.Luminosity) + ', ' +
        mysql.escape(req.body.Path) + ')';

    sql.query(insert,function(err, rows, fields) {
            if (err) console.log(insert);
            else ++saved// console.log('weather_save_cnt:' + (++w_save_cnt));
        });

    res.send("Success");
}


// app.post('/moving_object', 
exports.moving_object = function(req, res) {
    ++received
    var insert = 'insert into moving_object (Path,Source,Destination,Name,Time,Latitude,Longitude,Comment) values(' +
        mysql.escape(req.body.Path) + ', ' +
        mysql.escape(req.body.Source) + ', ' +
        mysql.escape(req.body.Destination) + ', ' +
        mysql.escape(req.body.Name) + ', ' +
        mysql.escape(toMysqlFormat(req.body.Time)) + ', ' +
        mysql.escape(req.body.Latitude) + ', ' +
        mysql.escape(req.body.Longitude) + ', ' +
        mysql.escape(req.body.Comment) + ')';

    sql.query(insert, function(err, rows, fields) {
            if (err) console.log(insert);
            else ++saved//console.log('MovingObject_save_cnt:' + (++o_save_cnt))
        });

    res.send("Success");
}

/*Convert JS date to MySQL date*/
function toMysqlFormat(date)
{
	date = date.slice(0,19).replace('T',' ');
	return date
}

sql.on('error', function(err) {
    console.log(err);
});

var in_buffer = 0

setInterval(function(){
    console.log("receive speed:"+received+"/s")
    in_buffer += received
    received = 0
}, 1000)
setInterval(function(){
    console.log("save speed:"+saved+"/s")
    in_buffer -= saved
    saved = 0
}, 1000)
setInterval(function(){
    console.log("in buffer:"+in_buffer)
}, 1000)
