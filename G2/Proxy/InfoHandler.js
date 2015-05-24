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
