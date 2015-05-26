var express = require('express');
var bodyParser = require('body-parser')
var mysql = require('mysql');

var wsql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weather'
});
var osql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moving_object'
});
var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var saved = 0
var w_save_cnt = 0
var o_save_cnt = 0
var received = 0

wsql.connect(function(err) {
    if (err)
        console.log('weather connect error', err);
});

osql.connect(function(err) {
    if (err)
        console.log('moving_object connect error', err);
});

//wsql.query('create table if not exists weather ( Type long int, Month long int, Day long int, Hour long int, Min long int, Sec long int, Lat long int, Long long int, WindDirection long int, WindSpeed long int, AprsDevice varchar(50), Gust long int, Temp long int, RainLastHr long int, RainLast24Hr long int, RainSinceMid long int, Humidity long int, Barometric long int, Luminosity long int)');
//osql.query('create table if not exists moving_object ( Source varchar(50), Latitude long int, Longitude long int, Name varchar(50), Time datetime, Speed long int, Course long int, Altitude long int,  Comment varchar(50) )');


app.post('/weather', function(req, res) {
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
    wsql.query(insert,function(err, rows, fields) {
            if (err) console.log(insert);
            else ++saved// console.log('weather_save_cnt:' + (++w_save_cnt));
        });

    res.send("Success");
});


app.post('/moving_object', function(req, res) {
	++received
    var insert = 'insert into moving_object (Path,Source,Destination,Name,Time,Latitude,Longitude,Comment) values(' +
        mysql.escape(req.body.Path) + ', ' +
        mysql.escape(req.body.Source) + ', ' +
        mysql.escape(req.body.Destination) + ', ' +
        mysql.escape(req.body.Name) + ', ' +
        mysql.escape(req.body.Time) + ', ' +
        mysql.escape(req.body.Latitude) + ', ' +
        mysql.escape(req.body.Longitude) + ', ' +
        mysql.escape(req.body.Comment) + ')';

    osql.query(insert, function(err, rows, fields) {
            if (err) console.log(insert);
            else ++saved//console.log('MovingObject_save_cnt:' + (++o_save_cnt))
        });

    res.send("Success");
});

app.listen(port);

wsql.on('error', function(err) {
    console.log('db error', err);
});

osql.on('error', function(err) {
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
