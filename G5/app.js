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

var w_save_cnt = 0
var o_save_cnt = 0

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
    var insert = 'insert into weather (Type,Month,Day,Hour,Min,Sec,Lat,Longi,WindDirection,WindSpeed,WeatherUnit,Gust,Temp,RainLastHr,RainLast24Hr,RainSinceMid,Humidity,Barometric,Luminosity,Path) values("' +
        req.body.Type + '", "' +
        req.body.Month + '", "' +
        req.body.Day + '", "' +
        req.body.Hour + '", "' +
        req.body.Min + '", "' +
        req.body.Sec + '", "' +
        req.body.Lat + '", "' +
        req.body.Longi + '", "' +
        req.body.WindDirection + '", "' +
        req.body.WindSpeed + '", "' +
        req.body.WeatherUnit + '", "' +
        req.body.Gust + '", "' +
        req.body.Temp + '", "' +
        req.body.RainLastHr + '", "' +
        req.body.RainLast24Hr + '", "' +
        req.body.RainSinceMid + '", "' +
        req.body.Humidity + '", "' +
        req.body.Barometric + '", "' +
        req.body.Luminosity + '", "' +
        req.body.Path.replace(/"/g,"\\\"") + '")';
    /*wsql.query(insert,function(err, rows, fields) {
            if (err) console.log(insert);
            else console.log('weather_save_cnt:' + (++w_save_cnt));
        });*/

    res.send("Success");
});


app.post('/moving_object', function(req, res) {
    try{
    var insert = 'insert into moving_object (Path,Source,Destination,Name,Time,Latitude,Longitude,Comment) values("' +
        req.body.Path.replace(/"/g,"\\\"") + '", "' +
        req.body.Source + '", "' +
        req.body.Destination + '", "' +
        req.body.Name + '", "' +
        req.body.Time + '", "' +
        req.body.Latitude + '", "' +
        req.body.Longitude + '", "' +
        req.body.Comment.replace(/\\/g,"\\\\").replace(/"/g,"\\\"") + '")';
    }catch(e){
        console.log(req.body)
    }
    
    osql.query(insert, function(err, rows, fields) {
            if (err) console.log(insert);
            else console.log('MovingObject_save_cnt:' + (++o_save_cnt))
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
