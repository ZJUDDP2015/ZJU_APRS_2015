var express = require('express');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');

var starttime;
var endtime;
var current;


var dbclient = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "moving_object"
});

var getFormatedTime = function(month, day, hour) {
  var stime = {};
  stime.day=(day<10 ? '0'+day:day);
  stime.month=month;
  stime.hour=(hour<10 ? '0'+hour:hour);
  return stime;
}
var compare = function(time,str){
  var day;
  var month;
  var hour;
  day=str.substr(5,2);
  hour=str.substr(17,2);
  switch (str.substr(8,3))
  {
    case 'Jan':month=1;break;
    case 'Feb':month=2;break;
    case 'Mar':month=3;break;
    case 'Apr':month=4;break;
    case 'May':month=5;break;
    case 'Jun':month=6;break;
    case 'Jul':month=7;break;
    case 'Aug':month=8;break;
    case 'Sep':month=9;break;
    case 'Oct':month=10;break;
    case 'Nov':month=11;break;
    case 'Dec':month=12;break;
  }
  if (time.month>month)
    return 1;
  else if (time.month==month&&time.day>day)
    return 1;
  else if (time.month==month&&time.day==day&&time.hour>hour)
    return 1;
  else
    return 0;
}
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Car'
    })
});

router.get('/data',function(req,res){
  dbclient.connect(function(err,results){
    dbclient.query("select * from moving_object",function(err,rows){
      var car=[];
      rows.forEach(function(e){
        if (e.Time!=null&&e.id>current){
          var start=compare(starttime,e.Time);
          var end=compare(endtime,e.Time);
          if (start==0&&end==1){
            var symbol=JSON.parse(e.Comment).Symbol;
            console.log(symbol);
            if (symbol != "" &&symbol!=undefined&& symbol[0]!='\\'&&symbol[0]!='/') {
              symbol = "\\\\" + symbol[1];
            }
            console.log(symbol);

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
                symbol:symbol,
                des: e.Destination,
                path: e.Path
            });
            current=e.id;
          }
        }
      });
      return res.json(car);
    });
  });
});

router.get('/map', function(req, res) {
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
    dbclient.connect(function(err, results) {
        dbclient.query("select * from moving_object", function(err, rows) {
            var car = [];
            rows.forEach(function(e) {
              if (e.Time!=null&&e.Longitude>73&&e.Longitude<135&&e.Latitude>20&&e.Latitude<53){
                //console.log(e.Time);
                var start=compare(stime,e.Time);
                var end=compare(etime,e.Time);
                  if (start==0&&end==1) {
                      var symbol=JSON.parse(e.Comment).Symbol;
                      if (symbol != "" && symbol[0]!='\\'&&symbol[0]!='/') {
                        symbol = "\\\\" + symbol[1];
                      }
                      console.log(symbol);
                      //console.log(symbol[0]!='\\'&&symbol[0]!='/');
                      car.push({
                          id: e.Source,
                          time: e.Time,
                          lat: e.Longitude,
                          lon: e.Latitude,
                          symbol:symbol,
                          des: e.Destination,
                          path: e.Path
                      });
                      current=e.id;
                      //console.log(e);
                  }
                }
            });
            //console.log(car);
            res.render('map', {
                title: 'Map',
                car: car
            });
        });
    });
});

module.exports = router;
