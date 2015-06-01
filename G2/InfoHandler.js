//display the latitude and longitude in the given format
function displayLat(lat) {
  var lat_final, temp;

  lat_final = parseFloat(lat.substring(0, 2)); //degrees
  temp = parseFloat(lat.substring(2, lat.length-1));
  lat_final += temp/60.0;
  if (lat.charAt(lat.length-1) == "S")
    lat_final *= -1;

  return lat_final;
}

function displayLong(long) {
  var long_final, temp;

  long_final = parseFloat(long.substring(0, 3)); //degrees
  temp = parseFloat(long.substring(3, long.length-1));
  long_final += temp/60.0;
  if (long.charAt(long.length-1) == "W")
    long_final *= -1;

  return long_final;
}

//for compressed data, decode the latitude and longitude
function decodeLat(lat) {
  var lat_final = 90 - ((lat.charCodeAt(0)-33)*Math.pow(91, 3) + (lat.charCodeAt(1)-33)*Math.pow(91, 2) + (lat.charCodeAt(2)-33)*91 + lat.charCodeAt(3)-33) / 380926;
  return lat_final;
}

function decodeLong(long) {
  var long_final = -180 + ((long.charCodeAt(0)-33)*Math.pow(91, 3) + (long.charCodeAt(1)-33)*Math.pow(91, 2) + (long.charCodeAt(2)-33)*91 + long.charCodeAt(3)-33) / 190463;
  return long_final;
}

//judge whether moving objects
function isMoving(symbol, dest_adr, src_adr) {
  var moves = 0;
  if (symbol.charAt(0) == "/") //information field (mostly stations)
  {
    switch (symbol.charAt(1))
    {
      case "!": case "$": case "'": case "*": case ",": case "<": case ">": case "C":
      case "O": case "P": case "R": case "S": case "U": case "V": case "X": case "Y":
      case "[": case "^": case "a": case "b": case "e": case "f": case "g": case "j":
      case "k": case "p": case "s": case "u": case "v":case "\\": moves = 1;
      break;
      default: break;
    }
  }
  else if (symbol.charAt(0) == "\\") //information field (mostly Objects)
  {
    switch (symbol.charAt(1))
    {
      case ",": case ">": case "S": case "^": case "s": case "u": case "v": moves = 1;
      break;
      default: break;
    }
  }
  else // information address symbol
  {
    if ((dest_adr.substr(0, 3)).localeCompare("GPS") == 0) //destination address is valid
    {
      switch (dest_adr.slice(4))
      {
        case "BB": case "BE": case "BH": case "BK": case "BM": case "MT": case "MV": case "PC":
        case "OM": case "NV": case "PO": case "PP": case "PR": case "PS": case "PU": case "PV":
        case "PX": case "PY": case "HS": case "HV": case "LA": case "LB": case "LE": case "LF":
        case "AS": case "DV": case "LG": case "LJ": case "LK": case "LP": case "LS": case "LU":
        case "LV": case "SS": case "SU": case "SV": case "01": case "04": case "07": case "10":
        case "12": case "28": case "30": case "35": case "47": case "48": case "50": case "51":
        case "53": case "54": case "56": case "57": case "59": case "62": case "65": case "66":
        case "69": case "70": case "71": case "74": case "75": case "80": case "83": case "85":
        case "86": moves = 1;
            break;
        default: break;
      }
    }
    else //SSID
    {
      var temp = src_adr.indexOf("-");
      src_adr = src_adr.slice(temp); //get SSID (-XXX)
      switch (src_adr)
      {
        case "-0": case "-1": case "-2": case "-3": case "-4": case "-5": case "-6": case "-7":
        case "-8": case "-9": case "-10": case "-11": case "-12": case "-13": case "-14": case "-15": moves = 1;
        break;
        default: moves = -1; break; //unknown object
      }
    }
  }
  return moves;
}

function setSymbol(obj, symbol, dest_adr) {   //set  up the symbol field of the final object
  if (symbol.charAt(1).match(/[\w\*!#\$%\^&\*\)\+,-\./;<>=\?']/)) { //information field
    obj["Symbol"] = symbol;
    if (symbol.charAt(0) != '/' && symbol.charAt(0) != '\\' && symbol.charAt(1).match(/[#&0>A\^acnsuvz]/)) //has overlay
      obj["Overlay"] = symbol.charAt(0);
  }
  else if ((dest_adr.substr(0, 3)).localeCompare("GPS") == 0) { //destination address is valid
    obj["Symbol"] = dest_adr.substr(0, dest_adr.length);
    if (dest_adr.slice(3, 5).match(/[A-Z][A-Z0-9]/) && dest_adr.charAt(5) != ' ') //has overlay
      obj["Overlay"] = dest_adr.charAt(5);
  }
  else obj["Symbol"] = "";
}

function getTime(time) {   //transfer the time field into date object
  var d = new Date();
  var s;
  if (time.charAt(6)=="z"){
    d.setUTCDate(parseInt(time.substring(0,2)));
    d.setUTCHours(parseInt(time.substring(2,4)));
    d.setUTCMinutes(parseInt(time.substring(4,6)));
    s = d.toUTCString();
  }
  else if (time.charAt(6)=="h"){
    d.setUTCHours(parseInt(time.substring(0,2)));
    d.setUTCMinutes(parseInt(time.substring(2,4)));
    d.setUTCSeconds(parseInt(time.substring(4,6)));
    s = d.toUTCString();
  }
  return (s);
}

function decodeCourse(c) {
  var course_final = (c.charCode-33) * 4;
  return course_final;
}

function decodeSpeed(s) {
  var speed_final = Math.pow(1.08,(s.charCode-33))-1;
  return speed_final;
}

function decodeAltitude(c, s) {
  var alt = Math.pow(1.002, ((c.charCode-33)*91 + parseInt(s.charCode)));
  return alt;
}

function decodeType(type) {
  var T;
  switch (type) { //type of shape
    case '0': T = "Circle"; break;
    case '1': T = "Line"; break;
    case '2': T = "Ellipse"; break;
    case '3': T = "Triangle"; break;
    case '4': T = "Box"; break;
    case '5': T = "Colour-filled circle"; break;
    case '6': T = "Line"; xx *= -1; break;
    case '7': T = "Colour-filled ellipse"; break;
    case '8': T = "Colour-filled triangle"; break;
    case '9': T = "Colour-filled box"; break;
    default: T = ""; break;
  }
  return T;
}

function decodeColour(colour) {
  var C;
  switch (colour) { //colour
    case "/0": C = "Black-High"; break;
    case "/1": C = "Blue-High"; break;
    case "/2": C = "Green-High"; break;
    case "/3": C = "Cyan-High"; break;
    case "/4": C = "Red-High"; break;
    case "/5": C = "Violet-High"; break;
    case "/6": C = "Yellow-High"; break;
    case "/7": C = "Gray-High"; break;
    case "/8": C = "Black-Low"; break;
    case "/9": C = "Blue-Low"; break;
    case "10": C = "Green-Low"; break;
    case "11": C = "Cyan-Low"; break;
    case "12": C = "Red-Low"; break;
    case "13": C = "Violet-Low"; break;
    case "14": C = "Yellow-Low"; break;
    case "15": C = "Gray-Low"; break;
  }
  return C;
}

function Wthr_dataDecoding(myDate, DataConvertedGroup) {
		var tarData = new Object();
		tarData.Type = 0;
		// 0 - undefine ; 1 - DayHrMin(UTC/GMT) z ; 2 - DayHrMin(Local) / ; 3 HrMinSec(UTC/GMT) h ; 4 MonDayHrMin(UTC/GMT)
		tarData.Month = 0;
		tarData.Day = 0;
		tarData.Hour = 0;
		tarData.Min = 0;
		tarData.Sec = 0;

		//Split Time
		tStr = DataConvertedGroup.TimeConverted;
		if (tStr.length == 7) {
				tail = tStr.charAt(6);
				//console.log(tail);
				switch (tail) {
						case 'z':
								tarData.Type = 1;
								tarData.Month = myDate.getUTCMonth() + 1;
								tarData.Day = parseInt(tStr.slice(0, 2));
								tarData.Hour = parseInt(tStr.slice(2, 4));
								tarData.Min = parseInt(tStr.slice(4, 6));
								break;
						case '/':
								tarData.Type = 2;
								tarData.Month = myDate.getMonth() + 1;
								tarData.Day = parseInt(tStr.slice(0, 2));
								tarData.Hour = parseInt(tStr.slice(2, 4));
								tarData.Min = parseInt(tStr.slice(4, 6));
								break;
						case 'h':
								tarData.Type = 3;
								tarData.Hour = parseInt(tStr.slice(0, 2));
								tarData.Min = parseInt(tStr.slice(2, 4));
								tarData.Sec = parseInt(tStr.slice(4, 6));
								break;
				}
		} else if (tStr.length == 8) {
				tarData.Type = 4;
				tarData.Month = parseInt(tStr.slice(0, 2));
				tarData.Day = parseInt(tStr.slice(2, 4));
				tarData.Hour = parseInt(tStr.slice(4, 6));
				tarData.Min = parseInt(tStr.slice(6, 8));
		} else {
				//console.log('Unknown Data');
				//console.log(tStr);
		}

		//Latitude
		tLat = DataConvertedGroup.latituteConverted;
		if (tLat.length == 4) {
				//y1 = (tLat.charCodeAt(0)-33) * (91*91*91);
				//y2 = (tLat.charCodeAt(1)-33) * (91*91);
				//y3 = (tLat.charCodeAt(2)-33) * (91);
				//y4 = (tLat.charCodeAt(3)-33) * (1);
				//tarData.Lat =  90 - (y1 + y2 + y3 + y4) / 380926;.
				tarData.Lat = decodeLat(tLat);
		} else {
				if (tLat.slice(7, 8) == 'N') {
						correct = parseInt(tLat.slice(0, 2));
						correct = correct + parseFloat(tLat.slice(2, 7)) / 60;
						tarData.Lat = correct;
				} else {
						correct = 0 - tLat.slice(0, 2);
						correct = correct - parseFloat(tLat.slice(2, 7)) / 60;
						tarData.Lat = correct;
				}
		}

		//Longtitude
		tLong = DataConvertedGroup.longitudeConverted;
		if (tLong.length == 4) {
				//x1 = (tLong.charCodeAt(0)-33) * (91*91*91);
				//x2 = (tLong.charCodeAt(1)-33) * (91*91);
				//x3 = (tLong.charCodeAt(2)-33) * (91);
				//x4 = (tLong.charCodeAt(3)-33) * (1);
				//tarData.Long =  -180 + (x1 + x2 + x3 + x4) / 190463;
				tarData.Longi = decodeLong(tLong);
		} else {
				if (tLong.slice(8, 9) == 'E') {
						correct = parseInt(tLong.slice(0, 3));
						correct = correct + parseFloat(tLong.slice(3, 8)) / 60;
						tarData.Longi = correct;
				} else {
						correct = 0 - tLong.slice(0, 3);
						correct = correct - parseFloat(tLong.slice(3, 8)) / 60;
						tarData.Longi = correct;
				}
		}

		var res = new Object();
		res.WeatherStr = DataConvertedGroup.WeatherDataConverted; //"c...s   g005t077r000p000P000h50b09900";
		res.WindDir_Speed = DataConvertedGroup.windInfoConverted; //"220/004";
		res.CompWindDir_Speed = DataConvertedGroup.compressedWindInfoConverted; //"7P";

		//Split WeatherStr
		wStr = res.WeatherStr;
		var extraStr = new Object();
		extraStr.WindDir_Speed = "";
		extraStr.CompWindDir_Speed = "";
		if (res.WindDir_Speed == "") extraStr.WindDir_Speed = "";
		else extraStr.WindDir_Speed = res.WindDir_Speed;
		if (res.CompWindDir_Speed == '') extraStr.CompWindDir_Speed = "";
		else extraStr.CompWindDir_Speed = res.CompWindDir_Speed;

		//WindDirection
		tarData.WindDirection = parseInt(wStr.slice(wStr.indexOf('c') + 1, wStr.indexOf('c') + 4)); // degrees
		if (tarData.WindDirection == "..." || tarData.WindDirection == "   ") tarData.WindDirection = 0;
		if (tarData.WindDirection == wStr.slice(0, 3)) tarData.WindDirection = 0;
		if (extraStr.WindDir_Speed != "") tarData.WindDirection = parseInt(extraStr.WindDir_Speed.slice(0, 3));
		if (extraStr.CompWindDir_Speed != '') {
				if (extraStr.CompWindDir_Speed.charAt(0) >= '!' && extraStr.CompWindDir_Speed.charAt(0) <= 'z') {
						//tarData.WindDirection = (extraStr.CompWindDir_Speed.charCodeAt(0) - 33) * 4;
						tarData.WindDirection = decodeCourse(extraStr.CompWindDir_Speed.charAt(0));
				}
		}

		//WindSpeed
		tarData.WindSpeed = parseInt(wStr.slice(wStr.indexOf('s') + 1, wStr.indexOf('s') + 4)); // mph
		if (tarData.WindSpeed == "..." || tarData.WindSpeed == "   ") tarData.WindSpeed = 0;
		if (tarData.WindSpeed == wStr.slice(0, 3)) tarData.WindSpeed = 0;
		if (extraStr.WindDir_Speed != "") tarData.WindSpeed = parseInt(extraStr.WindDir_Speed.slice(4, 7));
		if (extraStr.CompWindDir_Speed != "") {
				if (extraStr.CompWindDir_Speed.charAt(0) >= '!' && extraStr.CompWindDir_Speed.charAt(0) <= 'z') {
						//pow = 1.00;  eFlag = extraStr.CompWindDir_Speed.charCodeAt(1) - 33;
						//for(i=1; i<= eFlag; i++) pow = pow * 1.08;
						//tarData.WindSpeed = pow - 1;
						tarData.WindDirection = decodeSpeed(extraStr.CompWindDir_Speed.charAt(1)) * 1.151; //knot -> mph
				}
		}

		//AprsSoftware & WeatherUnit
		res.AprsSoft = DataConvertedGroup.SoftwareIdentifierConverted;
		aStr = res.AprsSoft;
		res.WeatherUnit = DataConvertedGroup.MachineIdentifierConverted;
		uStr = res.WeatherUnit;
		switch (aStr) {
				case "d":
						tarData.AprsSoft = "APRSdos";
						break;
				case "M":
						tarData.AprsSoft = "MacAPRS";
						break;
				case "P":
						tarData.AprsSoft = "pocketAPRS";
						break;
				case "S":
						tarData.AprsSoft = "APRS+SA";
						break;
				case "W":
						tarData.AprsSoft = "WinAPRS";
						break;
				case "X":
						tarData.AprsSoft = "X-APRS (Linux)";
						break;
				default:
						tarData.AprsSoft = res.AprsSoft;
		}

		switch (uStr) {
				case "Dvs":
						tarData.WeatherUnit = "Davis";
						break;
				case "HKT":
						tarData.WeatherUnit = "Heathkit";
						break;
				case "PIC":
						tarData.WeatherUnit = "PIC device";
						break;
				case "RSW":
						tarData.WeatherUnit = "Radio Shack";
						break;
				case "￼U-II":
						tarData.WeatherUnit = "Original Ultimeter U-II (auto mode)";
						break;
				case "￼￼￼U2R":
						tarData.WeatherUnit = "Original Ultimeter U-II (remote mode)";
						break;
				case "￼U2k￼￼￼":
						tarData.WeatherUnit = "Ultimeter 500/2000";
						break;
				case "U2kr":
						tarData.WeatherUnit = "Remote Ultimeter logger";
						break;
				case "￼U5￼￼￼":
						tarData.WeatherUnit = "Ultimeter 500";
						break;
				case "Upkm":
						tarData.WeatherUnit = "Remote Ultimeter packet mode";
						break;
				default:
						tarData.WeatherUnit = res.WeatherUnit;
		}


		//Gust
		tarData.Gust = parseInt(wStr.slice(wStr.indexOf('g') + 1, wStr.indexOf('g') + 4)); // mph (peak speed in the last 5min)
		if (tarData.Gust == "..." || tarData.Gust == "   ") tarData.Gust = 0;
		if (tarData.Gust == wStr.slice(0, 3)) tarData.Gust = 0;
		//Temp
		tarData.Temp = parseInt(wStr.slice(wStr.indexOf('t') + 1, wStr.indexOf('t') + 4)); // degrees Fahrenheit
		if (tarData.Temp == "..." || tarData.Temp == "   ") tarData.Temp = 0;
		if (tarData.Temp == wStr.slice(0, 3)) tarData.Temp = 0;
		//RainLastHr
		tarData.RainLastHr = parseInt(wStr.slice(wStr.indexOf('r') + 1, wStr.indexOf('r') + 4)); // hundredths of an inch
		if (tarData.RainLastHr == wStr.slice(0, 3)) tarData.RainLastHr = 0;
		//if(tarData.RainLastHr == wStr.slice(0, 3)) tarData.RainLastHr = 0;
		//RainLast24Hr
		tarData.RainLast24Hr = parseInt(wStr.slice(wStr.indexOf('p') + 1, wStr.indexOf('p') + 4));
		if (tarData.RainLast24Hr == wStr.slice(0, 3)) tarData.RainLast24Hr = 0;
		//if(tarData.RainLast24Hr == wStr.slice(0, 3)) tarData.RainLast24Hr = 0;
		//RainSinceMid
		tarData.RainSinceMid = parseInt(wStr.slice(wStr.indexOf('P') + 1, wStr.indexOf('P') + 4));
		if (tarData.RainSinceMid == wStr.slice(0, 3)) tarData.RainSinceMid = 0;
		//if(tarData.RainSinceMid == wStr.slice(0, 3)) tarData.RainSinceMid = 0;
		//Humidity
		tarData.Humidity = parseInt(wStr.slice(wStr.indexOf('h') + 1, wStr.indexOf('h') + 3)); // in %.00 = 100%
		if (tarData.Humidity == wStr.slice(0, 2)) tarData.Humidity = 0;
		//if(tarData.Humidity == wStr.slice(0, 3)) tarData.Humidity = 0;
		//Barometric
		tarData.Barometric = parseInt(wStr.slice(wStr.indexOf('b') + 1, wStr.indexOf('b') + 5));
		if (tarData.Barometric == wStr.slice(0, 4)) tarData.Barometric = 0;
		//if(tarData.Barometric == wStr.slice(0, 3)) tarData.Barometric = 0;
		tarData.Luminosity = parseInt(wStr.slice(wStr.indexOf('L') + 1, wStr.indexOf('L') + 4));
		if (tarData.Luminosity == wStr.slice(0, 3)) tarData.Luminosity = 0;
		// in watts per meter^2 <= 999
		//wea.Luminosity2 = wStr.slice(wStr.indexOf('l')+1, wStr.indexOf('l')+4);
		//wea.SnowfallLast24Hr = wStr.slice(wStr.indexOf('s')+1, wStr.indexOf('s')+4);  //in inches
		//wea.RawRainCounter = wStr.slice(wStr.indexOf('#')+1, wStr.indexOf('#')+4);
		//console.log(tarData);
		return tarData;
}

function Wthr_dealWithSoftIdentifier(WeatherData) {

		var s = WeatherData.search(/[csgtrPphbLl][0123456789.]{2,5}/);
		var WeatherDataSplit = "";

		while (s != -1) {
				//Find a weatherData

				if (WeatherData != undefined) {

						if (WeatherData.charAt(s) == 'c') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) == 's') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) == 'g') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) == 't') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) == 'r') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) === 'P') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) === 'p') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) == 'h') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 3));
								WeatherData = WeatherData.substring(s + 3, WeatherData.length);

						} else if (WeatherData.charAt(s) == 'b') {

								if (WeatherData.charAt(s + 5) >= '0' && WeatherData.charAt(s + 5) <= '9') {
										WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 6));
										WeatherData = WeatherData.substring(s + 6, WeatherData.length);
								} else {
										WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 5));
										WeatherData = WeatherData.substring(s + 5, WeatherData.length);
								}

						} else if (WeatherData.charAt(s) === 'L') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 4));
								WeatherData = WeatherData.substring(s + 4, WeatherData.length);

						} else if (WeatherData.charAt(s) === 'l') {

								WeatherDataSplit = WeatherDataSplit.concat(WeatherData.substr(0, 5));
								WeatherData = WeatherData.substring(s + 5, WeatherData.length);
						}

				}

				//Split it and form a new String
				s = WeatherData.search(/[csgtrPphbLl][0123456789.]{2,5}/);
		}

		MachineIdentifier = WeatherData;

		var objectReturn = new Object;
		objectReturn.weather = WeatherDataSplit;
		objectReturn.machine = MachineIdentifier;

		return objectReturn;
}

exports.displayLat = displayLat;
exports.displayLong = displayLong;
exports.decodeLat = decodeLat;
exports.decodeLong = decodeLong;
exports.isMoving = isMoving;
exports.setSymbol = setSymbol;
exports.getTime = getTime;
exports.decodeCourse = decodeCourse;
exports.decodeSpeed = decodeSpeed;
exports.decodeAltitude = decodeAltitude;
exports.decodeType = decodeType;
exports.decodeColour = decodeColour;
exports.Wthr_dataDecoding = Wthr_dataDecoding;
exports.Wthr_dealWithSoftIdentifier = Wthr_dealWithSoftIdentifier;
