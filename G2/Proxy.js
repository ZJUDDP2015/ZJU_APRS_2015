var net = require('net');
var fs = require("fs");
var router = require("./DataRouter.js");
var logger = require("./Logger.js");

var proxy = net.connect({port:14580,host:'asia.aprs2.net'},function() {
    var myDate = new Date();
    console.log(myDate.toUTCString() + ": connection to server!");
    proxy.write("user BG5ZZZ-85 pass 24229 ver MY185\n#filter t/poi\n");
});

proxy.on("error",function(err){
    var myDate = new Date();
    console.log(myDate.toUTCString() + ": " + err.message);
    proxy.end();
/*    proxy.connect({port:14580,host:'asia.aprs2.net'},function() {
        console.log("connection to server!");
        proxy.write("user BG5ZZZ-85 pass 24229 ver MY185\n#filter t/poi\n");
    });*/
});

proxy.on('end',function(){
    var myDate = new Date();
    console.log(myDate.toUTCString() + ": proxy unconnected.");
    proxy.connect({port:14580,host:'asia.aprs2.net'},function() {
        console.log("connection to server!");
        proxy.write("user BG5ZZZ-85 pass 24229 ver MY185\n#filter t/poi\n");
  });
})

proxy.on('data',function(data){
  var myDate = new Date();
  var array = data.toString().split('\r\n');
  var i = 0;
  for(i = 0; i < array.length - 1; i++) {
    logger.file_write(array[i] + '\r\n', './log/Received.log', myDate);
    var header=array[i].split(':')[0];
    var info=array[i].slice(header.length+1);
    if(header && info && (header.indexOf('>') != -1)) {
      var Rtn;
      if (info[0] == '!') { // Position without Timestamp and no APRS Messaging
        Rtn = router.MvOb_without_Timestamp(myDate, header, info);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MvOb.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else {
          Rtn = router.Wthr_without_Timestamp_no_Message(myDate, header, info);
          if (Rtn.handle)
            logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
          else
            logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
        }
      }
      else if (info[0] == '=') { // Position without Timestamp with APRS Messaging
        Rtn = router.MvOb_without_Timestamp(myDate, header, info);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MvOb.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else {
          Rtn = router.Wthr_without_Timestamp_with_Message(myDate, header, info);
          if (Rtn.handle)
            logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
          else
            logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
        }
      }
      else if (info[0] == '/' || info[0] == '@') { // Position with timestamp
        Rtn = router.MvOb_with_Timestamp(myDate, header, info);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MvOb.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else {
          Rtn = router.Wthr_with_Timestamp(myDate, header, info);
          if (Rtn.handle)
            logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
          else
            logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
        }
      }
      else if (info[0] == ';') { // object
        Rtn = router.MvOb_Object(myDate, header, info);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MvOb.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else {
          Rtn = router.Wthr_Object(myDate, header, info);
          if (Rtn.handle)
            logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
          else
            logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
        }
      }
      else if (info[0] == ')') { // item
        Rtn = router.MvOb_Item(myDate, header, info);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MvOb.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else
          logger.file_write('[MvOb] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == "'" || info[0] == '`') { // Mic-E encoded moving objects
        Rtn = router.MicE_Handle(myDate, array[i]);
        if (Rtn.handle) {
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/MicE.log', myDate);
          if ((Rtn.res.Latitude > 90) || (Rtn.res.Latitude < -90))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/LatErr.log', myDate);
          if ((Rtn.res.Longitude > 73) && (Rtn.res.Longitude < 135))
            logger.file_write('[MicE] ' + array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/China.log', myDate);
        }
        else
          logger.file_write('[MicE] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '#' || info[0] == '$' || info[0] == '*') {
        Rtn = router.Wthr_Peet_Bros_or_rawGPS(myDate, header, info);
        if (Rtn.handle)
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '_') {
        Rtn = router.Wthr_Weather_Report(myDate, header, info);
        if (Rtn.handle)
          logger.file_write(array[i] + '\r\n' + JSON.stringify(Rtn.res) + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else {
        logger.file_write(array[i] + '\r\n', './log/Discarded.log', myDate);
      }
    }
    else {
      logger.file_write(array[i] + '\r\n', './log/Discarded.log', myDate);
    }
  }
});
