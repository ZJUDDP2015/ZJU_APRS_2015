var router=express().router();
var mysql=require('mysql');
var db = mysql.createConnection(require("./DBconfig.json"));

Date.prototype.Format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
};

db.connect(function (err) {
  console.error(err);
});

router.post('/DataWithinOneHour',function (req,res) {
    console.log(req.url);
    console.log(req.body);  //body={CallSign:'CallSign'}

    var returnData=[];

    var date=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
    var date_tmp = new Date();
    var datep = (new Date(date_tmp.getTime()-60*60*1000)).Format("yyyy-MM-dd hh:mm:ss");
    console.log(date);
    console.log(datep);

    var query='select * from moving_object where name=? && Time<=？ && Time>=？order by Time desc';
    var queryAug=[req.body.CallSign,date,datep];

    db.query(query,queryAug,function (err,rows) {
      var data=[];
      rows.forEach(function (chunk) {
        console.log(chunk);
        returnData[returnData.length]=chunk;
      });
    });
    var LastPosition={returnData[0][6],returnData[0][7]};
    res.json({
	 lastPos:LastPosition,
	 data:returnData
    });

});
