var mysql = require('mysql');
var url = require('url');
var client = mysql.createConnection(require("../DBconfig.json"));

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

exports.handleData = function(req, res) {
    var lon_limit = {"small_lon":parseFloat(req.query.sw_lng), "big_lon":parseFloat(req.query.ne_lng)};//当前屏幕的经度范围
    var lat_limit = {"small_lat":parseFloat(req.query.sw_lat), "big_lat":parseFloat(req.query.ne_lat)};//当前屏幕的纬度范围
    var starttime = req.query.starttime;
    var endtime = req.query.endtime;
    var callsign = req.query.callsign;
    console.log(starttime);
    console.log(endtime);
    console.log(callsign);
    if (starttime==''||endtime=='')
    {
      starttime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate() - 1, (new Date()).getHours(), (new Date()).getMinutes()); //初始化时间(开始时间为当前一天前)
      endtime = getFormatedTime((new Date()).getMonth() + 1, (new Date()).getDate(), (new Date()).getHours(), (new Date()).getMinutes());
    }
    client.connect(function(err,results){
        console.log(starttime);
        console.log(endtime);
        var Addsql;
        var Addsql_param;
        if (callsign =='')
        {
          var Addsql="select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?)";
          var Addsql_param=[lat_limit.small_lat,lat_limit.big_lat,lon_limit.small_lon,lon_limit.big_lon,starttime,endtime];
        }
        else
        {
          var Addsql="select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > unix_timestamp(?) &&unix_timestamp(Time) < unix_timestamp(?) &&Source=?";
          var Addsql_param=[lat_limit.small_lat,lat_limit.big_lat,lon_limit.small_lon,lon_limit.big_lon,starttime,endtime,callsign];
        }
        //console.log(Addsql_param);
        client.query(Addsql,Addsql_param,function(err,rows){
            var car=[];
            if (rows){
                console.log("hello");
                rows.forEach(function(e){
                    console.log("fuck");
                    console.log(e);
                    var symbol=JSON.parse(e.Comment).Symbol;
                    console.log(symbol);
                    if (symbol != "" &&symbol!=undefined&& symbol[0]!='\\'&&symbol[0]!='/') {
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
                        symbol:symbol,
                        des: e.Destination,
                        path: e.Path
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
    client.connect(function(err, results) {//连接数据库，筛选出当前scale内的数据)
        var now =(new Date()).getTime()/1000-3600*15;//获取当前时间前一个小时
        var Addsql="select *from moving_object where Latitude >? && Latitude <? && Longitude > ? && Longitude < ? && unix_timestamp(Time) > ? ";
        var Addsql_param=[lat_limit.sl,lat_limit.bl,lon_limit.sl,lon_limit.bl,now];
        client.query(Addsql,Addsql_param,function(err,rows){
            var car = [];
            rows.forEach(function(e) {
              //if (e.Time!=null&&e.Longitude>73&&e.Longitude<135&&e.Latitude>20&&e.Latitude<53){
                //console.log(e.Time);
                //var start=compare(stime,e.Time);
                //var end=compare(etime,e.Time);
                  //var Now=getFormatedTime(t.getMonth(),t.getDate(),t.getHours()-1);//获取当前时间前一个小时
                  //var first_time=compare(Now,e.Time);
                  //if (first_time==0) {//获得数据库内一个小时内的数据
                      var symbol=JSON.parse(e.Comment).Symbol;
                      if (symbol != "" && symbol[0]!='\\'&&symbol[0]!='/') {
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
                          symbol:symbol,
                          des: e.Destination,
                          path: e.Path
                      });
                      current=e.id;//最近的一条数据
                      //console.log(e);
                  //}
                //}
            });
            //console.log(car);
            res.render('map', {
                title: 'Map',
                car: car,
                scale:scale_i
            });
        });
    });
};

