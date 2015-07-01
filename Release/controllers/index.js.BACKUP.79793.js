var express = require('express');
var Promise = require("bluebird");
var mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var client = mysql.createConnection(require("../DBconfig.json"));
var connection;

Promise.promisifyAll(fs);

function toMysqlFormat(date) {
    return date.getFullYear() + "-" + twoDigits(1 + date.getMonth()) + "-" + twoDigits(date.getDate()) + " " + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds());
};

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
};

exports.createCallsignEjs = function(callsign, res) {
    var i;
    var myDate = new Date();
    var currentT = toMysqlFormat(myDate);
    var sql_60 = 'select * from moving_object where Source=? and Time <= ?  and Time >= DATE_ADD(?,INTERVAL -60 MINUTE) order by Time desc';
    var sql_60_param = [callsign, currentT, currentT];
    var sql_recent = "select Longitude, Latitude from moving_object where Source=? order by Time desc LIMIT 1";
    var sql_recent_param = [callsign];
    var filename = __dirname + '/../views/callsign.ejs';
<<<<<<< HEAD
    var lastPos = {};
=======
>>>>>>> 935afac4088142f7f69b765e66c536f0b4f11be6

    client.connect(function(err, results) {
        client.query(sql_recent, sql_recent_param, function(err, rows) {
            fs.writeFileAsync(filename, "")
            .then(fs.appendFileSync(filename, '<html lang="en">\r\n'))
            .then(fs.appendFileSync(filename, '<head>\r\n'))
            .then(fs.appendFileSync(filename, '<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />\r\n'))
            .then(fs.appendFileSync(filename, '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n'))
            .then(fs.appendFileSync(filename, '<title><%= title %></title>\r\n'))
            .then(fs.appendFileSync(filename, '</head>\r\n'))
            .then(fs.appendFileSync(filename, '<body>\r\n'))
            .then(fs.appendFileSync(filename, '<div><h1> ' + callsign + ' </h1></div>\r\n'))
            .then(fs.appendFileSync(filename, '<div><h2> Last position: Latitude = ' + rows[0].Latitude + '; Longitude' + rows[0].Longitude + ' </h2></div>\r\n'))
            .then(fs.appendFileSync(filename, '<div><h2> data during the last 60 minutes: </h2></div>'))
            .then(function() {
                client.query(sql_60, sql_60_param, function(err, rows) {
                    console.log(rows);
                    if (rows.length == 0) {
                        fs.appendFileSync(filename, '<div> This station has no data in 60 minutes! </div>');
                    }
                    else {
                        for (i=0; i < rows.length; ++i) {
                            console.log(i);
                            var writeBuffer = new Buffer(JSON.stringify(rows[i]))
                            fs.appendFileSync(filename, '<div> ' + i + ':   ' + writeBuffer + '</div>\r\n');
                        }
                    }
                    fs.appendFileSync(filename, '</body>\r\n');
                    fs.appendFileSync(filename, '</html>\r\n');
                    res.render("callsign", {
                        title: 'Callsign'
                    })
                });
            })
<<<<<<< HEAD
        });
        client.query(sql_60, sql_60_param, function(err, rows) {
            console.log(rows);
            res.render("rawData", {
                title: callsign,
                data: rows
            });
        });
    });
};
=======
        })
    })
}
>>>>>>> 935afac4088142f7f69b765e66c536f0b4f11be6

var getFormatedTime = function(month, day, hour, minute) {
    var stime = "2015";
    if (hour < 0) {
        hour += 24;
        day--;
    }
    stime += '-' + (month < 10 ? '0' + month : month);
    stime += '-' + (day < 10 ? '0' + day : day);
    stime += ' ' + (hour < 10 ? '0' + hour : hour);
    stime += ':' + (minute < 10 ? '0' + minute : minute) + ':00';
    return stime;
};

exports.handleZoomoutData = function(req, res) {
    var start_time=new Date().getTime();
    var row_num=req.query.row_num;
    var col_num=req.query.col_num;
    var level = req.query.level;

    var lng_num = Number(req.query.lng_num);
    var lat_num = Number(req.query.lat_num);

    var lng_len = 0.1;
    var lat_len = 0.1;

    var starttime = req.query.starttime;
    var endtime = req.query.endtime;
    var callsign = req.query.callsign;
    //定义返回的二维数组
    var draw = [[]];
    //定义draw被赋值的次数
    var count = 0;

    //console.log(starttime);
    //console.log(endtime);
    //console.log(callsign);
    if (starttime == '' || endtime == '') {
        starttime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours()-1, (new Date()).getMinutes()); //初始化时间(开始时间为当前一天前)
        endtime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours(), (new Date()).getMinutes());
    }
    //计算相关增量
    var incre = 1<<level;
    //连接数据库
    client.connect(function(err, results) {
        //console.log(starttime);
        //console.log(endtime);
        var Addsql;
        var Addsql_param;
        Addsql_param = [lat_num,lat_num+row_num*incre,lng_num,lng_num+col_num*incre , starttime, endtime];
        if (callsign == '') {
            Addsql = "select Grid_latitude,Grid_longitude,count(*) as num from moving_object where Grid_latitude >=? && Grid_latitude <? && Grid_longitude >= ? && Grid_longitude <? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) group by Grid_latitude,Grid_longitude";
        } else {
            Addsql = "select Grid_latitude,Grid_longitude,count(*) as num from moving_object where Grid_latitude >=? && Grid_latitude <? && Grid_longitude >= ? && Grid_longitude <? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=? group by Grid_latitude,Grid_longitude";
            Addsql_param.push(callsign);
        }
        for (i=0;i<row_num;++i)
            draw[i] = [];
        client.query(Addsql, Addsql_param,function(err,rows){
            if (typeof(rows)!='undefined'){
                for (i=0;i<rows.length;++i){
                    draw[Math.floor((rows[i].Grid_latitude-lat_num)/incre)][Math.floor((rows[i].Grid_longitude-lng_num)/incre)]=rows[i].num;
                }
                //console.log(Addsql_param)
                console.log("zoomout delay:"+(new Date().getTime()-start_time))
                return res.json(draw);
            }
        });
    });
};


exports.handleData = function(req, res) {
    var lon_limit = {
        "small_lon": parseFloat(req.query.sw_lng),
        "big_lon": parseFloat(req.query.ne_lng)
    }; //当前屏幕的经度范围
    var lat_limit = {
        "small_lat": parseFloat(req.query.sw_lat),
        "big_lat": parseFloat(req.query.ne_lat)
    }; //当前屏幕的纬度范围
    var starttime = req.query.starttime;
    var endtime = req.query.endtime;
    var callsign = req.query.callsign;
    console.log(starttime);
    console.log(endtime);
    console.log(callsign);
    if (starttime == '' || endtime == '') {
        starttime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours() - 1, (new Date()).getMinutes()); //初始化时间(开始时间为当前一天前)
        endtime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours(), (new Date()).getMinutes());
    }

    client.connect(function(err, results) {
        console.log(starttime);
        console.log(endtime);
        var Addsql;
        var Addsql_param;
        if (callsign == '') {
            var Addsql = "select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) order by Time asc";
            var Addsql_param = [lat_limit.small_lat, lat_limit.big_lat, lon_limit.small_lon, lon_limit.big_lon, starttime, endtime];
        } else {
            var Addsql = "select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=? order by Time asc";
            var Addsql_param = [lat_limit.small_lat, lat_limit.big_lat, lon_limit.small_lon, lon_limit.big_lon, starttime, endtime, callsign];
        }
        //console.log(Addsql_param);
        var car = [];
        client.query(Addsql, Addsql_param, function(err, rows) {
            if (rows) {
                console.log("hello");
                rows.forEach(function(e) {
                    //console.log("fuck");
                    //console.log(e);
                    var symbol = JSON.parse(e.Comment).Symbol;
                    //console.log(symbol);
                    if (symbol != "" && symbol != undefined && symbol[0] != '\\' && symbol[0] != '/') {
                        symbol = "\\\\" + symbol[1];
                    }
                    //console.log(symbol);

                    /*var symbol=JSON.parse(e.Comment).Symbol;
                    if (symbol[0]!='\\'&&symbol[0]!='/')
                      symbol[0]='\\';*/
                    //console.log(symbol);
                    //console.log(symbol[0]!='\\'&&symbol[0]!='/');
                    car.push({
                        id: e.Source,
                        time: e.Time,
                        lat: e.Longitude,
                        lon: e.Latitude,
                        symbol: symbol,
                        des: e.Destination,
                        path: e.Path,
                        comment: e.Comment
                    });
                });
                //return res.json(car);
            }

            if (callsign == '') {
<<<<<<< HEAD
                Addsql = "select *from weather where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) order by Time asc";
                Addsql_param = [lat_limit.small_lat, lat_limit.big_lat, lon_limit.small_lon, lon_limit.big_lon, starttime, endtime];
            } else {
                Addsql = "select *from weather where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=? order by Time asc";
=======
                Addsql = "select *from weather where Lat >? && Lat <? && Longi > ? && Longi < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) order by Time asc";
                Addsql_param = [lat_limit.small_lat, lat_limit.big_lat, lon_limit.small_lon, lon_limit.big_lon, starttime, endtime];
            } else {
                Addsql = "select *from weather where Lat >? && Lat <? && Longi > ? && Longi < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=? order by Time asc";
>>>>>>> 935afac4088142f7f69b765e66c536f0b4f11be6
                Addsql_param = [lat_limit.small_lat, lat_limit.big_lat, lon_limit.small_lon, lon_limit.big_lon, starttime, endtime, callsign];
            }

            client.query(Addsql,Addsql_param,function (err,rows) {
<<<<<<< HEAD
              if(rows){
                console.log('Weather data');
                rows.forEach(function (e) {
                  var symbol = JSON.parse(e.Comment).Symbol;
                  //console.log(symbol);
                  if (symbol !== "" && symbol !== undefined && symbol[0] !== '\\' && symbol[0] !== '/') {
                      symbol = "\\\\" + symbol[1];
                  }

                  car.push({
                    IsWeather:true,
                    id: e.Source,
                    symbol: symbol,
                    time: e.Time,
                    lat: e.Lat,
                    lon: e.Longi,
=======
              console.log("get");
              if(rows){
                console.log('Weather data');
                rows.forEach(function (e) {
                  var symbol = "\\"+e.SymbolCode;
                  //console.log(symbol);
                  //if (symbol !== "" && symbol !== undefined && symbol[0] !== '\\' && symbol[0] !== '/') {
                  //    symbol = "\\\\" + symbol[1];
                  //}

                  car.push({
                    IsWeather:true,
                    type:e.Type,
                    id: e.Source,
                    symbol: symbol,
                    time: e.Time,
                    lat: e.Longi,
                    lon: e.Lat,
>>>>>>> 935afac4088142f7f69b765e66c536f0b4f11be6
                    path: e.Path,
                    WindDirection: e.WindDirection,
                    WindSpeed: e.WindSpeed,
                    WeatherUnit: e.WeatherUnit,
                    Gust: e.Gust,
                    Temp: e.Temp,
                    RainLastHr: e.RainLastHr,
                    RainLast24Hr: e.RainLast24Hr,
                    RainSinceMid: e.RainSinceMid,
                    Humidity: e.Humidity,
                    Barometric: e.Barometric,
                    Luminosity: e.LUMINOSITY
                    //
                  });

                });
              }
<<<<<<< HEAD

=======
              console.log(car);
>>>>>>> 935afac4088142f7f69b765e66c536f0b4f11be6
              return res.json(car);

            });


          });
    });
};

exports.handleClick = function(req, res) {
    var current = 0;
    /*
    var carid = req.query.id || 0,
        smonth = req.query.smonth || 0,
        sday = req.query.sday || 0,
        shour = req.query.shour || 0,
        emonth = req.query.emonth || 0,
        eday = req.query.eday || 0,
        ehour = req.query.ehour || 0;

    var stime = getFormatedTime(smonth, sday, shour),
        etime = getFormatedTime(emonth, eday, ehour);

        starttime=stime;
        endtime=etime;
    */
    client.connect(function(err, results) { //连接数据库，筛选出当前scale内的数据)
        var now = (new Date()).getTime() / 1000 - 3600 * 15; //获取当前时间前一个小时
        var Addsql = "select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > ? ";
        var Addsql_param = [lat_limit.sl, lat_limit.bl, lon_limit.sl, lon_limit.bl, now];
        client.query(Addsql, Addsql_param, function(err, rows) {
            var car = [];
            rows.forEach(function(e) {
                //if (e.Time!=null&&e.Longitude>73&&e.Longitude<135&&e.Latitude>20&&e.Latitude<53){
                //console.log(e.Time);
                //var start=compare(stime,e.Time);
                //var end=compare(etime,e.Time);
                //var Now=getFormatedTime(t.getMonth(),t.getDate(),t.getHours()-1);//获取当前时间前一个小时
                //var first_time=compare(Now,e.Time);
                //if (first_time==0) {//获得数据库内一个小时内的数据
                var symbol = JSON.parse(e.Comment).Symbol;
                if (symbol != "" && symbol[0] != '\\' && symbol[0] != '/') {
                    symbol = "\\\\" + symbol[1];
                }
                console.log(symbol);
                //console.log(symbol[0]!='\\'&&symbol[0]!='/');
                car.push({
                    id: e.Source,
                    id: e.id,
                    　source: e.Source,
                    time: e.Time,
                    lat: e.Longitude,
                    lon: e.Latitude,
                    symbol: symbol,
                    des: e.Destination,
                    path: e.Path,
                    comment: e.Comment
                });
                current = e.id; //最近的一条数据
                //console.log(e);
                //}
                //}
            });
            //console.log(car);
            res.render('map', {
                title: 'Map',
                car: car,
                scale: scale_i
            });
        });
    });
};
