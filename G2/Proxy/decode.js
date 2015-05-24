function decode(rec, myDate){
  var Info = {};
  var Path = new Array();
  var i = rec.search(">") + 7;
  var mic = rec.substr(rec.search(">") + 1, 6);
  var Source = rec.substr(0, rec.search(">"));
  Info.Source = Source;
  Info.Destination = mic;

  var regexp1= /(WIDE.*|[Qq]AC|[Qq]AX|[Qq]AU|[Qq]Ao|[Qq]AO|[Qq]AS|[Qq]Ar|[Qq]AR|[Qq]AZ|[Qq]AI|TCPIP.*|TRACE.*|RELAY.*)/
  var j=rec.search(",");
  var End=rec.search(":");
  var comma;
  while(j<End){
    comma=rec.indexOf(",",j+1);
    if(comma==-1 || comma>End){
      comma=rec.search(":");
    }
    var digi=rec.substr(j+1,comma-j-1);
    console.log(digi);
    if(!regexp1.test(digi)){
      var astic=digi.indexOf("*",0);
      if(astic==-1)   Path.push(digi);
      else{
        digi=digi.substr(0,astic);
        Path.push(digi);
      }
      console.log(Path);
    }
    else j=comma;
    j=comma;
  }
  Info.Path = Path;

  if (mic.length != 6)
    return;
  var regexp = /^[0-9A-LP-Z]+$/;
  if(!regexp.test(mic))
    return;

  var map = {};
  map["0"] = {"LatDigit" : 0, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["1"] = {"LatDigit" : 1, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["2"] = {"LatDigit" : 2, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["3"] = {"LatDigit" : 3, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["4"] = {"LatDigit" : 4, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["5"] = {"LatDigit" : 5, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["6"] = {"LatDigit" : 6, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["7"] = {"LatDigit" : 7, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["8"] = {"LatDigit" : 8, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["9"] = {"LatDigit" : 9, "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["A"] = {"LatDigit" : 0, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["B"] = {"LatDigit" : 1, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["C"] = {"LatDigit" : 2, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["D"] = {"LatDigit" : 3, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["E"] = {"LatDigit" : 4, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["F"] = {"LatDigit" : 5, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["G"] = {"LatDigit" : 6, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["H"] = {"LatDigit" : 7, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["I"] = {"LatDigit" : 8, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["J"] = {"LatDigit" : 9, "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["K"] = {"LatDigit" : " ", "Msg" : "1C", "NS" : "NULL", "LongOff" : "NULL", "WE" : "NULL"};
  map["L"] = {"LatDigit" : " ", "Msg" : "0", "NS" : "South", "LongOff" : 0, "WE" : "East"};
  map["P"] = {"LatDigit" : 0, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["Q"] = {"LatDigit" : 1, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["R"] = {"LatDigit" : 2, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["S"] = {"LatDigit" : 3, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["T"] = {"LatDigit" : 4, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["U"] = {"LatDigit" : 5, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["V"] = {"LatDigit" : 6, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["W"] = {"LatDigit" : 7, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["X"] = {"LatDigit" : 8, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["Y"] = {"LatDigit" : 9, "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};
  map["Z"] = {"LatDigit" : " ", "Msg" : "1S", "NS" : "North", "LongOff" : 100, "WE" : "West"};

  var MicMsg = {};
  MicMsg[0] = "Emergency";
  MicMsg[1] = {"S" : "M6: Priority", "C" : "C6: Custom-6"};
  MicMsg[2] = {"S" : "M5: Special", "C" : "C5: Custom-5"};
  MicMsg[3] = {"S" : "M4: Committed", "C" : "C4: Custom-4"};
  MicMsg[4] = {"S" : "M3: Returning", "C" : "C3: Custom-3"};
  MicMsg[5] = {"S" : "M2: In Service", "C" : "C2: Custom-2"};
  MicMsg[6] = {"S" : "M1: En Route", "C" : "C1: Custom-1"};
  MicMsg[7] = {"S" : "M0: Off Duty", "C" : "C0: Custom-0"};

  var LatiD = parseInt(map[mic[0]].LatDigit + map[mic[1]].LatDigit);
  var LatiM = parseInt(map[mic[2]].LatDigit + map[mic[3]].LatDigit);
  var LatiH = parseInt(map[mic[4]].LatDigit + map[mic[5]].LatDigit);
  var Latitude = LatiD + LatiM/60 + LatiH/3600;
  var NS = map[mic[3]].NS;
  var WE = map[mic[5]].WE;
  if(NS == "South")Latitude = -Latitude;
  Info.Latitude = Latitude;
  Info.LongOff = map[mic[4]].LongOff;

  // mic-e message
  var msgIdx = parseInt(map[mic[0]].Msg[0]) * 4 + parseInt(map[mic[1]].Msg[0]) * 2 + parseInt(map[mic[2]].Msg[0]);
  // configure message type
  var msgTyp = "0";
  if (map[mic[0]].Msg[0] != "0")
    msgTyp = map[mic[0]].Msg[1];
  else if (map[mic[1]].Msg[0] != "0")
    msgTyp = map[mic[1]].Msg[1];
  else if (map[mic[2]].Msg[0] != "0")
    msgTyp = map[mic[2]].Msg[1];
  else
    msgTyp = "E";

  // assign message
  var Message;
  if (msgTyp == "E")
    Message = MicMsg[0];
  else if (msgTyp == "S")
    Message = MicMsg[msgIdx].S;
  else if (msgTyp == "C")
    Message = MicMsg[msgIdx].C;
  var Comments = {};
  Comments.MicMsg = Message;

  //to find where the Infomation field starts
  while((i<rec.length) && ((rec[i - 1] != ':') || ((rec[i]!='`') && (rec[i] != '\''))))
    i++;

  //to decode the longitute degrees
  var LongD = rec[++i].charCodeAt()-28;
  if(Info.LongOff == 100)
    LongD += 100;
  if(LongD>=180 && LongD<=189)
    LongD -= 80;
  if(LongD>=190 && LongD<=199)
    LongD -= 190;

  //to decode the longitute minutes
  var LongM = rec[++i].charCodeAt()-28;
  if(LongM>=60)
    LongM -= 60;

  //to decode the longitute hundredths
  var LongH = rec[++i].charCodeAt()-28;

  var Longitude = LongD + LongM/60 + LongH/3600;
  if(WE == "West")Longitude = -Longitude;
  Info.Longitude = Longitude;

  //to decode the speed and course
  if (i + 3 < rec.length) {
    var SP = rec[++i].charCodeAt()-28;
    var DC = rec[++i].charCodeAt()-28;
    var SE = rec[++i].charCodeAt()-28;
    var speed;
    var course;
    //if(SP<=99 && SP>=80) SP -= 80;
    speed = SP*10+parseInt(DC/10);
    //Info["SP"] = SP*10;
    course = (DC%10)*100+SE;
    if(speed>=800)
      speed -= 800;
    if(course>=400)
      course -= 400;
    Info.Speed = speed;
    Info.Course = course;
  }

  //to decode the symbol
  var flag = 0;
  if (i + 2 < rec.length) {
    var SymbolID = rec[i + 2];
    var SymbolCode = rec[i + 1];
    var Symbol = SymbolID + SymbolCode;
    if(rec[i + 2] == '/' || rec[i + 2] == '\\'){
      if(SymbolCode.charCodeAt()>=33 && SymbolCode.charCodeAt()<=126){
        flag = 1;
      }
    }
  }

  if(flag = 1){Comments.Type = Symbol};
  Info.Comments = JSON.stringify(Comments);

  //to find where the status text ends
  //var i = 0;
  i += 3;
  while(i<rec.length && rec[i]!='}')
    i++;
  if(i < rec.length || rec[i]=='}') {
      //to decode the status text
      var altitude;
      var alti3 = rec[i-1].charCodeAt()-33;
      var alti2 = rec[i-2].charCodeAt()-33;
      var alti1 = rec[i-3].charCodeAt()-33;
      altitude = alti3 + alti2*91 + alti1*91*91 - 10000;
      Info.Altitude = altitude;
  }
  Info.Time = myDate.toUTCString();
  return Info;
  //console.log(JSON.stringify(Info));
}
exports.decode = decode;
