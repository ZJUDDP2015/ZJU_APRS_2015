var express = require('express');
var router = express.Router();
var url=require('url');
var mysql=require('mysql');

var getFormatedTime = function(month, day, hour) {
  var stime = '2015';
  stime += '-' + (month < 10 ? '0' + month : month);
  stime += '-' + (day < 10 ? '0' + day : day);
  stime += ' ' + (hour < 10 ? '0' + hour : hour);
  return stime;
}
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Car'
  })
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
  var dbclient = mysql.createConnection({
    host: "XXX",
    user: "XXX",
    password: "XXX",
    database: "XXX"
  });
  dbclient.connect(function(err, results) {
    dbclient.query("select * from car", function (err, rows) {
      var car = [];
      rows.forEach(function (e) {
        if (e.ID == carid && JSON.stringify(stime) < JSON.stringify(e.time) && JSON.stringify(etime) > JSON.stringify(e.time)) {
          car.push({
            id: e.ID,
            time: JSON.stringify(e.time),
            lat: e.lat,
            lon: e.lon
          });
        }
      });
      console.log(car);
      res.render('map', {
        title: 'Map',
        car: car
      });
    });
  });
});
module.exports = router;
