function getPath(header) {
  var Path = new Array();
  var wholePath = header.substring(header.indexOf('>') + 1);
  var chop = wholePath.split(',');
  var regexp = /(WIDE.*|[Qq]AC|[Qq]AX|[Qq]AU|[Qq]Ao|[Qq]AO|[Qq]AS|[Qq]Ar|[Qq]AR|[Qq]AZ|[Qq]AI|TCPIP.*|TRACE.*|RELAY.*|APRS.*)/

  for(var i = 1; i < chop.length; i++) {
      if(!regexp.test(chop[i])) {
        var astic = chop[i].indexOf("*");
        if(astic==-1)
          Path.push(chop[i]);
        else{
          chop[i] = chop[i].substr(0, astic);
          Path.push(chop[i]);
        }
      }
  }
  return JSON.stringify(Path);
}

exports.getPath = getPath;
