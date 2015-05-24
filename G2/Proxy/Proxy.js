var express = require('express');
var net = require('net');
var fs = require("fs");
var router = require("./DataRouter.js");
var logger = require("./Logger.js");

var proxy = net.connect({port:14580,host:'hangzhou.aprs2.net'},function() {
    console.log("connection to server!");
    proxy.write("user BG5ZZZ-85 pass 24229 ver MY185\n#filter t/poi\n");
});

proxy.on("error",function(err){
    console.log(err.message);
});

proxy.on('end',function(){
  console.log('proxy unconnected.');
  proxy = net.connect({port:14580,host:'hangzhou.aprs2.net'},function() {
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
      if (info[0] == '!') { // Position without Timestamp and no APRS Messaging
        if (router.MvOb_without_Timestamp(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/MvOb.log', myDate);
        else if (router.Wthr_without_Timestamp_no_Message(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '=') { // Position without Timestamp with APRS Messaging
        if (router.MvOb_without_Timestamp(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/MvOb.log', myDate);
        else if (router.Wthr_without_Timestamp_with_Message(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '/' || info[0] == '@') { // Position with timestamp
        if (router.MvOb_with_Timestamp(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/MvOb.log', myDate);
        else if (router.Wthr_with_Timestamp(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == ';') { // object
        if (router.MvOb_Object(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/MvOb.log', myDate);
        else if (router.Wthr_Object(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[MvOb & Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == ')') { // item
        if (router.MvOb_Item(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/MvOb.log', myDate);
        else
          logger.file_write('[MvOb] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == "'" || info[0] == '`') { // Mic-E encoded moving objects
        if (router.MicE_Handle(myDate, array[i]))
          logger.file_write(array[i] + '\r\n', './log/MicE.log', myDate);
        else
          logger.file_write('[MicE] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '#' || info[0] == '$' || info[0] == '*') {
        if (router.Wthr_Peet_Bros_or_rawGPS(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
        else
          logger.file_write('[Wthr] ' + array[i] + '\r\n', './log/Discarded.log', myDate);
      }
      else if (info[0] == '_') {
        if (router.Wthr_Weather_Report(myDate, header, info))
          logger.file_write(array[i] + '\r\n', './log/Wthr.log', myDate);
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
