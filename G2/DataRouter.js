var headerHandler = require("./HeaderHandler.js");
var infoHandler = require("./InfoHandler.js");
var miceDecoder = require('./MicEDecode.js');
var poster = require("./Poster.js")
var logger = require("./Logger.js");
var fs = require("fs");

function MvOb_without_Timestamp(myDate, header, info) {
  var object={};
  var com_obj={};
  var symbol="";
  var message="";
  var c="";
  var s="";
  var Rtn = {};

  object["Path"] = headerHandler.getPath(header);
  object["Source"] = header.split('>')[0]; //source of the report
  object["Destination"] = header.split('>')[1].split(',')[0];  //destination of the report
  object["Time"]=myDate;
//  object["Time"]=object["Time"].toUTCString();

  if (info[1] != '/') {//uncompressed
    object["Latitude"] = infoHandler.displayLat(info.slice(1, 9));
    object["Longitude"] = infoHandler.displayLong(info.slice(10, 19));
    symbol = info.charAt(9) + info.charAt(19);
    com_obj["Comment"] = info.slice(20);
    if (symbol == "/\\") { //deal with the course/speed BRG and RNQ
      object["Course"] = parseInt(info.slice(20, 23));
      object["Speed"] = parseInt(info.slice(24, 27));
      com_obj["BRG"] = parseInt(info.slice(28, 31));
      com_obj["NRQ"] = parseInt(info.slice(32, 35));
      com_obj["Comment"] = info.slice(35);
    } else {  //no BRG and NRQ
      message = info.slice(20, 36);
      if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]\/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
        object["Course"] = parseInt(message.slice(0, 3));
        object["Speed"] = parseInt(message.slice(4, 7));
        object["Altitude"] = parseInt(message.slice(10));
        com_obj["Comment"] = info.slice(36);
      } else if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]/)) {
        object["Course"] = parseInt(message.slice(0, 3));
        object["Speed"] = parseInt(message.slice(4, 7));
        com_obj["Comment"] = info.slice(27);
      } else if (message.match(/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
        object["Altitude"] = parseInt(message.slice(3, 9));
        com_obj["Comment"] = info.slice(29);
      } else {
        com_obj["Comment"] = info.slice(20);
      }
    }
  } else { //compressed data
    object["Latitude"] = infoHandler.decodeLat(info.slice(2, 6));
    object["Longitude"] = infoHandler.decodeLong(info.slice(6, 10));
    symbol = info.charAt(1) + info.charAt(10);
    c = info.charAt(11);
    s = info.charAt(12);
    com_obj["Type"] = info.charAt(13);
    com_obj["Comment"] = info.slice(14);
    if (c.charCode >= 0 && c.charCode <= 89) {
      object["Course"] = infoHandler.decodeCourse(c);
      object["Speed"] = infoHandler.decodeSpeed(s);
    }
    if (c != ' ' && ((com_obj["Type"].charCode - 33) % 32 >= 16 && (com_obj["Type"].charCode - 33) % 32 <= 23)) {
      object["Altitude"] = infoHandler.decodeAltitude(c, s);
    }
  }
  if (symbol.localeCompare("/_") != false) //not weather or Mic-E data
  {
    if (object["Destination"])
      infoHandler.setSymbol(com_obj, symbol, object["Destination"]);
    object["Comment"] = JSON.stringify(com_obj);
    poster.SendtoDB(object, "/data/moving_object");
    Rtn.handle = true;
    Rtn.res = object;
  } else {
    Rtn.handle = false;
  }
  return Rtn;
}

function MvOb_with_Timestamp(myDate, header, info) {
  var object={};
  var com_obj={};
  var symbol="";
  var message="";
  var c="";
  var s="";
  var Rtn = {};

  object["Path"] = headerHandler.getPath(header);
  object["Source"] = header.split('>')[0]; //source of the report
  object["Destination"] = header.split('>')[1].split(',')[0];  //destination of the report

  if (info[8] != '/') { //uncompressed
    object["Time"] = infoHandler.getTime(info.slice(1, 8));
    object["Latitude"] = infoHandler.displayLat(info.slice(8, 16));
    object["Longitude"] = infoHandler.displayLong(info.slice(17, 26));
    symbol = info.charAt(16) + info.charAt(26);
    com_obj["Comment"] = info.slice(27);
    if (symbol == "/\\") { //deal with the course/speed BRG and RNQ
      object["Course"] = parseInt(info.slice(27, 30));
      object["Speed"] = parseInt(info.slice(31, 34));
      com_obj["BRG"] = parseInt(info.slice(35, 38));
      com_obj["NRQ"] = parseInt(info.slice(39, 42));
      com_obj["Comment"] = info.slice(42);
    } else {
      message = info.slice(27, 43);
      if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]\/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
        object["Course"] = parseInt(message.slice(0, 3));
        object["Speed"] = parseInt(message.slice(4, 7));
        object["Altitude"] = parseInt(message.slice(10));
        com_obj["Comment"] = info.slice(43);
      } else if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]/)) {
        object["Course"] = parseInt(message.slice(0, 3));
        object["Speed"] = parseInt(message.slice(4, 7));
        com_obj["Comment"] = info.slice(34);
      } else if (message.match(/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
        object["Altitude"] = parseInt(message.slice(3, 9));
        com_obj["Comment"] = info.slice(36);
      } else {
        com_obj["Comment"] = info.slice(27);
      }
    }
  } else {  //compressed data
    object["Time"] = infoHandler.getTime(info.slice(1, 8));
    object["Latitude"] = infoHandler.decodeLat(info.slice(9, 13));
    object["Longitude"] = infoHandler.decodeLong(info.slice(13, 17));
    symbol = info.charAt(8) + info.charAt(17);
    c = info.charAt(18);
    s = info.charAt(19);
    com_obj["Type"] = info.charAt(20);
    com_obj["Comment"] = info.slice(21);
    if (c.charCode >= 0 && c.charCode <= 89) {
      object["Course"] = infoHandler.decodeCourse(c);
      object["Speed"] = infoHandler.decodeSpeed(s);
    }
    if (c != ' ' && ((com_obj["Type"].charCode - 33) % 32 >= 16 && (com_obj["Type"].charCode - 33) % 32 <= 23)) {
      object["Altitude"] = infoHandler.decodeAltitude(c, s);
    }
  }
  if (symbol.localeCompare("/_") != false) //not weather or Mic-E data
  {
    if(object["Destination"])
      infoHandler.setSymbol(com_obj, symbol, object["Destination"]);
    object["Comment"] = JSON.stringify(com_obj);
    poster.SendtoDB(object, "/data/moving_object");
    Rtn.handle = true;
    Rtn.res = object;
  } else {
    Rtn.handle = false;
  }
  return Rtn;
}

function MvOb_Object(myDate, header, info) {
  var object={};
  var com_obj={};
  var symbol="";
  var message="";
  var c="";
  var s="";
  var Rtn = {};

  object["Path"] = headerHandler.getPath(header);
  object["Source"] = header.split('>')[0]; //source of the report
  object["Destination"] = header.split('>')[1].split(',')[0];  //destination of the report

  if (info[18] != '/') { //non-compressed
    object["Name"] = info.slice(1, 10);
    object["Time"] = infoHandler.getTime(info.slice(11, 18));
    object["Latitude"] = infoHandler.displayLat(info.slice(18, 26));
    object["Longitude"] = infoHandler.displayLong(info.slice(27, 36));
    symbol = info.charAt(26) + info.charAt(36);
    com_obj["Comment"] = info.slice(37);
    if (info.charAt(10) == '*')
      com_obj["isLive"] = 1;
    else if (info.charAt(10) == '_')
      com_obj["isLive"] = 0;
    else com_obj["isLive"] = -1;
    if (symbol.localeCompare("\\l") == 0) { //area object
      com_obj["Shape"] = infoHandler.decodeType(info.charAt(37));
      com_obj["Lat Offset"] = parseInt(info.slice(38, 40));
      com_obj["Colour"] = infoHandler.decodeColour(info.slice(40, 42));
      com_obj["Long Offset"] = (info.charAt(37) == '6' ? parseInt(info.slice(42, 44)) * -1 : parseInt(info.slice(42, 44)));
      object["Comment"] = info.slice(44);
    } else if (symbol.localeCompare("\\m") == 0) { //signpost object
      com_obj["Signpost"] = info.slice(37, info.indexOf('}') + 1);
      com_obj["Comment"] = info.slice(info.indexOf('}') + 1);
    }
    message = info.slice(37, 53);
    if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]\/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
      object["Course"] = parseInt(message.slice(0, 3));
      object["Speed"] = parseInt(message.slice(4, 7));
      object["Altitude"] = parseInt(message.slice(10));
      com_obj["Comment"] = info.slice(53);
    } else if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]/)) {
      object["Course"] = parseInt(message.slice(0, 3));
      object["Speed"] = parseInt(message.slice(4, 7));
      com_obj["Comment"] = info.slice(44);
    } else if (message.match(/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
      object["Altitude"] = parseInt(message.slice(3, 9));
      com_obj["Comment"] = info.slice(46);
    } else {
      com_obj["Comment"] = info.slice(37);
    }
  } else { //compressed
    object["Name"] = info.slice(1, 10);
    object["Time"] = infoHandler.getTime(info.slice(11, 18));
    object["Latitude"] = infoHandler.decodeLat(info.slice(19, 23));
    object["Longitude"] = infoHandler.decodeLong(info.slice(23, 27));
    symbol = info.charAt(18) + info.charAt(27);
    c = info.charAt(28);
    s = info.charAt(29);
    com_obj["Type"] = info.charAt(30);
    if (c != ' ' && ((com_obj["Type"].charCode - 33) % 32 >= 16 && (com_obj["Type"].charCode - 33) % 32 <= 23)) {
      object["Altitude"] = infoHandler.decodeAltitude(c, s);
    } else if (c.charCode >= 0 && c.charCode <= 89) {
      object["Course"] = infoHandler.decodeCourse(c);
      object["Speed"] = infoHandler.decodeSpeed(s);
    }
    com_obj["Comment"] = info.slice(30);
  }
  if (symbol.localeCompare("/_") != false) //not weather or Mic-E data
  {
    if (object["Destination"])
      infoHandler.setSymbol(com_obj, symbol, object["Destination"]);
    object["Comment"] = JSON.stringify(com_obj);
    poster.SendtoDB(object, "/data/moving_object");
    Rtn.handle = true;
    Rtn.res = object;
  } else {
    Rtn.handle = false;
  }
  return Rtn;
}

function MvOb_Item(myDate, header, info) {
  var object={};
  var com_obj={};
  var symbol="";
  var message="";
  var c="";
  var s="";
  var Rtn = {};

  object["Path"] = headerHandler.getPath(header);
  object["Source"] = header.split('>')[0]; //source of the report
  object["Destination"] = header.split('>')[1].split(',')[0];  //destination of the report

  var item_front = info.split('!' || '_')[0];
  var item_back = info.slice(item_front.length);
  if (item_back[1] != '/') { //non-compressed
    if (item_back.charAt(0) == '!')
      com_obj["isLive"] = 1;
    else
      com_obj["isLive"] = 0;
    object["Latitude"] = infoHandler.displayLat(item_back.slice(1, 9));
    object["Longitude"] = infoHandler.displayLong(item_back.slice(10, 19));
    object["Name"] = item_front.slice(1);
    symbol = item_back.charAt(9) + item_back.charAt(19);
    if (symbol.localeCompare("\\m") == 0) {
      com_obj["Signpost"] = item_back.slice(21, item_back.indexOf('}'))
      com_obj["Comment"] = item_back.slice(item_back.indexOf('}') + 1);
    }
    message = item_back.slice(20, 36);
    if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]\/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
      object["Course"] = parseInt(message.slice(0, 3));
      object["Speed"] = parseInt(message.slice(4, 7));
      object["Altitude"] = parseInt(message.slice(10));
      com_obj["Comment"] = item_back.slice(36);
    } else if (message.match(/[0-9][0-9][0-9]\/[0-9][0-9][0-9]/)) {
      object["Course"] = parseInt(message.slice(0, 3));
      object["Speed"] = parseInt(message.slice(4, 7));
      com_obj["Comment"] = item_back.slice(27);
    } else if (message.match(/A=[-0-9][0-9][0-9][0-9][0-9][0-9]/)) {
      object["Altitude"] = parseInt(message.slice(3, 9));
      com_obj["Comment"] = info.slice(29);
    } else
      com_obj["Comment"] = item_back.slice(20);
  } else { //compressed
    if (item_back.charAt(0) == '!')
      com_obj["isLive"] = 1;
    else
      com_obj["isLive"] = 0;

    object["Latitude"] = infoHandler.decodeLat(item_back.slice(2, 6));
    object["Longitude"] = infoHandler.decodeLong(info.slice(6, 10));
    object["Name"] = item_front.slice(1);
    symbol = item_back.charAt(1) + item_back.charAt(10);
    c = item_back.charAt(11);
    s = item_back.charAt(12);
    com_obj["Type"] = item_back.charAt(13);
    if (c != ' ' && ((com_obj["Type"].charCode - 33) % 32 >= 16 && (com_obj["Type"].charCode - 33) % 32 <= 23)) {
      object["Altitude"] = infoHandler.decodeAltitude(c, s);
    } else if (c.charCode >= 0 && c.charCode <= 89) {
      object["Course"] = infoHandler.decodeCourse(c);
      object["Speed"] = infoHandler.decodeSpeed(s);
    }
    com_obj["Comment"] = item_back.slice(14);
  }
  if (symbol.localeCompare("/_") != false) //not weather or Mic-E data
  {
    if (object["Destination"])
      infoHandler.setSymbol(com_obj, symbol, object["Destination"]);
    object["Comment"] = JSON.stringify(com_obj);
    poster.SendtoDB(object, "/data/moving_object");
    Rtn.handle = true;
    Rtn.res = object;
  } else {
    Rtn.handle = false;
  }
  return Rtn;
}

function MicE_Handle(myDate, d_msg){
    var Rtn = {};
    var haha = miceDecoder.decode(d_msg, myDate);
    if (JSON.stringify(haha) != undefined) {
      poster.SendtoDB(haha, "/data/moving_object");
      Rtn.handle = true;
      Rtn.res = haha;
    }
    else {
      Rtn.handle = false;
    }
    return Rtn;
}

function Wthr_with_Timestamp(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  if (info.charAt(16) == '/') {
    //Complete Weather data with Lat/Long and Time Stamp
    time = info.substring(1, 8);
    latitute = info.substring(8, 16);
    longitude = info.substring(17, 26);
    windInfo = info.substring(27, 34);
    compressedWindInfo = '';
    WeatherData = info.substring(34, info.length);
  } else {
    //Complete Weather data with Compressed Lat/Long and Time Stamp
    time = info.substring(1, 8);
    latitute = info.substring(9, 13);
    longitude = info.substring(13, 17);
    compressedWindInfo = info.substring(18, 20);
    windInfo = '';
    WeatherData = info.substring(21, info.length);
  }

  //Deal with Identifier
  infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);

  //Deal with data to be returned
  var newObj = infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
  WeatherData = newObj.weather;
  MachineIdentifier = newObj.machine;

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/data/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

function Wthr_without_Timestamp_no_Message(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  var newWeatherData;
  if (info.charAt(2) != '!') {
    if (info.charAt(9) == '/') {
      //Complete Weather data with Lat/Long and NO Time Stamp
      time = '';
      ObjName = '';
      latitute = info.substring(1, 9);
      longitude = info.substring(10, 19);
      windInfo = info.substring(21, 28);
      compressedWindInfo = '';
      WeatherData = info.substring(28, info.length);
    } else {
      //Complete Weather data with Compressed Lat/Long and NO Time Stamp
      time = '';
      ObjName = '';
      latitute = info.substring(2, 6);
      longitude = info.substring(6, 10);
      compressedWindInfo = info.substring(11, 13);
      windInfo = '';
      WeatherData = info.substring(14, info.length);
    }

    infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
    var newObj = infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
    WeatherData = newObj.weather;
    MachineIdentifier = newObj.machine;
  } else {
    var rawWeatherData = info.substring(1, info.length);
  }

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

function Wthr_without_Timestamp_with_Message(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  var newWeatherData;
  if (info.charAt(9) == '/') {
      //Complete Weather data with Lat/Long and NO Time Stamp
      time = '';
      ObjName = '';
      latitute = info.substring(1, 9);
      longitude = info.substring(10, 19);
      windInfo = info.substring(20, 27);
      compressedWindInfo = '';
      WeatherData = info.substring(27, info.length);
  } else {
      //Complete Weather data with Compressed Lat/Long and NO Time Stamp
      time = '';
      ObjName = '';
      latitute = info.substring(2, 6);
      longitude = info.substring(6, 10);
      compressedWindInfo = info.substring(11, 13);
      windInfo = '';
      WeatherData = info.substring(14, info.length);
  }

  infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
  var newObj = infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
  WeatherData = newObj.weather;
  MachineIdentifier = newObj.machine;

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/data/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

function Wthr_Object(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  var newWeatherData;
  ObjName = info.substring(1, 10);
  if (info.charAt(17) == 'z') {
      time = info.substring(11, 18);
      latitute = info.substring(18, 26);
      longitude = info.substring(27, 36);
      windInfo = info.substring(37, 44);
      compressedWindInfo = '';
      WeatherData = info.substring(44, info.length);
  } else {
      time = '';
      latitute = info.substring(11, 19);
      longitude = info.substring(20, 29);
      windInfo = info.substring(30, 37);
      compressedWindInfo = '';
      WeatherData = info.substring(37, info.length);
  }

  var newObj = infoHandler.Wthr_dealWithSoftIdentifier(WeatherData);
  WeatherData = newObj.weather;
  MachineIdentifier = newObj.machine;

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

function Wthr_Peet_Bros_or_rawGPS(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  var rawWeatherData = info.substring(1, info.length);

  time = '';
  ObjName = '';
  latitute = '';
  longitude = '';
  compressedWindInfo = '';
  windInfo = '';
  WeatherData = '';

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/data/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

function Wthr_Weather_Report(myDate, header, info) {
  var ObjName;
  var time;
  var latitute;
  var longitude;
  var windInfo;
  var compressedWindInfo;
  var WeatherData;
  var SoftwareIdentifier;
  var MachineIdentifier;
  var Rtn = {};

  var rawWeatherData = info.substring(10, info.length);

  time = rawWeatherData.substring(0, 7);
  ObjName = '';
  latitute = '';
  longitude = '';
  compressedWindInfo = '';
  windInfo = '';
  WeatherData = rawWeatherData.substring(8, rawWeatherData.length);

  var weatherDataGroup = {
    objNameConverted: ObjName,
    TimeConverted: time,
    latituteConverted: latitute,
    longitudeConverted: longitude,
    windInfoConverted: windInfo,
    compressedWindInfoConverted: compressedWindInfo,
    WeatherDataConverted: WeatherData,
    SoftwareIdentifierConverted: SoftwareIdentifier,
    MachineIdentifierConverted: MachineIdentifier
  }

  var receivedObject = infoHandler.Wthr_dataDecoding(myDate, weatherDataGroup);
  if (JSON.stringify(receivedObject) != undefined) {
    receivedObject.Path = headerHandler.getPath(header);
    poster.SendtoDB(receivedObject, "/data/weather");
    Rtn.handle = true;
    Rtn.res = receivedObject;
  }
  else {
    Rtn.handle = false;
  }
  return Rtn;
}

exports.MvOb_without_Timestamp = MvOb_without_Timestamp;
exports.MvOb_with_Timestamp = MvOb_with_Timestamp;
exports.MvOb_Object = MvOb_Object;
exports.MvOb_Item = MvOb_Item;
exports.MicE_Handle = MicE_Handle;
exports.Wthr_with_Timestamp = Wthr_with_Timestamp;
exports.Wthr_without_Timestamp_no_Message = Wthr_without_Timestamp_no_Message;
exports.Wthr_without_Timestamp_with_Message = Wthr_without_Timestamp_with_Message;
exports.Wthr_Object = Wthr_Object;
exports.Wthr_Peet_Bros_or_rawGPS = Wthr_Peet_Bros_or_rawGPS;
exports.Wthr_Weather_Report = Wthr_Weather_Report;
