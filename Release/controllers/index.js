var mysql = require('mysql');
var url = require('url');
var fs = require('fs');
var client = mysql.createConnection(require("../DBconfig.json"));

function toMysqlFormat(date) {
    return date.getFullYear() + "-" + twoDigits(1 + date.getMonth()) + "-" + twoDigits(date.getDate()) + " " + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds());
};

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
};

exports.createCallsignEjs = function(callsign) {
    var myDate = new Date();
    var currentT = toMysqlFormat(myDate);
    console.log(callsign);
    console.log(currentT);
    client.connect(function(err, results) {
        var Addsql = "select * from moving_object where Source=? and Time <= ?  and Time >= DATE_ADD(?,INTERVAL -60 MINUTE) order by Time desc";
        var Addsql_param = [callsign, currentT, currentT];
        client.query(Addsql, Addsql_param, function(err, rows) {
            if (err) {
                throw err;
            }
            if (rows.length > 0) {
                var i = 0;
                console.log(__dirname);
                var Stream = fs.createWriteStream(__dirname + '/../views/callsign.ejs', {
                    flags: 'w'
                });
                lat = rows[0].Latitude;
                longi = rows[0].Longitude;
                Stream.write('<html lang="en">\r\n');
                Stream.write('<head>\r\n');
                Stream.write('<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />\r\n');
                Stream.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n');
                Stream.write('<title><%= title %></title>\r\n');
                Stream.write('</head>\r\n');
                Stream.write('<body>\r\n');
                Stream.write('<div><h1> ' + rows[0].Source + ' </h1></div>\r\n');
                Stream.write('<div><h2> Last position: Latitude = ' + lat + '; Longitude' + longi + ' </h2></div>\r\n');
                Stream.write('<div><h2> data during the last 60 minutes: </h2></div>');
                for (i; i < rows.length; ++i) {
                    console.log(i);
                    var writeBuffer = new Buffer(JSON.stringify(rows[i]));
                    Stream.write('<div> ' + i + ':   ' + writeBuffer + '</div>\r\n');
                }
                Stream.write('</body>\r\n');
                Stream.write('</html>\r\n');
                Stream.end();
            } else {
                var Stream = fs.createWriteStream(__dirname + '/../views/callsign.ejs', {
                    flags: 'w'
                });
                Stream.write('<html lang="en">\r\n');
                Stream.write('<head>\r\n');
                Stream.write('<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />\r\n');
                Stream.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r\n');
                Stream.write('<title><%= title %></title>\r\n');
                Stream.write('</head>\r\n');
                Stream.write('<body>\r\n');
                Stream.write('<div><h1> Sorry, Not found </h1></div>\r\n');
                Stream.write('</body>\r\n');
                Stream.write('</html>\r\n');
                Stream.end();
            }
        });
    });
    return true;
}

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
}

exports.handleZoomoutData = function(req, res) {
    var start_time=new Date().getTime();
    var row_num=req.query.row_num;
    var col_num=req.query.col_num;
    var level = req.query.level;

    var lng_len = 0.18;
    var lat_len = 0.18;

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
    var lon_incre = Number(lng_len)*(1<<Number(level));
    var lat_incre = Number(lat_len)*(1<<Number(level));
    //连接数据库
    client.connect(function(err, results) {
        //console.log(starttime);
        //console.log(endtime);
        var Addsql;
        var Addsql_param;
        for (var i = 0; i < row_num; i++) {
            draw[i] = [];
            for (var j = 0; j < col_num; j++) {
                Addsql_param = [(Number(req.query.lat_num) + i) * lat_incre-90,(Number(req.query.lat_num) + i+1) * lat_incre-90, (Number(req.query.lng_num) + j) * lon_incre-180, (Number(req.query.lng_num) + j+1) * lon_incre-180, starttime, endtime];
                if (callsign == '') {
                    Addsql = "select count(*) as num from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?)";       
                } else {
                    Addsql = "select count(*) as num from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=?";
                    Addsql_param.push(callsign);
                }
                ZoomoutQuery(Addsql, Addsql_param,i,j,function(err,rows,i,j){
                    if (typeof(rows)=='undefined'){
                        draw[i][j] = 0;
                    }else{
                        draw[i][j] = rows[0].num;
                        //console.log('++'+rows[0].num)
                    }
                    count++;
                    if (count == (row_num) * (col_num)){
                        console.log("zoomout delay: %d\n",(new Date()).getTime()-start_time)
                        return res.json(draw);
                    }

                });
            }
        }
    });
};

function ZoomoutQuery(Addsql, Addsql_param,i,j,callback){
    client.query(Addsql, Addsql_param, function(err, rows) {
        //console.log('++'+rows[0].num)
        return callback(err,rows,i,j)
    });
}

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

        client.query(Addsql, Addsql_param, function(err, rows) {
            var car = [];
            if (rows) {
                console.log("hello");
                rows.forEach(function(e) {
                    console.log("fuck");
                    console.log(e);
                    var symbol = JSON.parse(e.Comment).Symbol;
                    console.log(symbol);
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
                return res.json(car);
            }
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
