var fs = require("fs");

var RcveStream = fs.createWriteStream('./log/Received.log', {flags:'a'});
var MvObStream = fs.createWriteStream('./log/MvOb.log', {flags:'a'});
var MicEStream = fs.createWriteStream('./log/MicE.log', {flags:'a'});
var WthrStream = fs.createWriteStream('./log/Wthr.log', {flags:'a'});
var DscdStream = fs.createWriteStream('./log/Discarded.log', {flags:'a'});
var LErrStream = fs.createWriteStream('./log/LatErr.log', {flags:'a'});
var ChnaStream = fs.createWriteStream('./log/China.log', {flags:'a'});
var rawErrStream = fs.createWriteStream('./log/rawErr.log', {flags:'a'});

function file_write(content, file, myDate) {
  if (file == './log/Received.log')
    RcveStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/MvOb.log')
    MvObStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/MicE.log')
    MicEStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/Wthr.log')
    WthrStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/Discarded.log')
    DscdStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/LatErr.log')
    LErrStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/China.log')
    ChnaStream.write('['+myDate.toUTCString()+']'+content);
  if (file == './log/rawErr.log')
    rawErrStream.write('['+myDate.toUTCString()+']'+content);
}

exports.file_write = file_write;
