var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var ServerList = new Array();

//console.log(binPath);
var childArgs = [
  path.join(__dirname, '/phantomScript.js'),
  'http://status.aprs2.net'
];

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  //handle results;
  var count = 0;
  if (err) {
    console.log(err);
  }
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    //console.log(stdout);
    //dealwith .html file of "status.apr2.net"
    var stringList = stdout.split('\n');
    for (var i = 0; i < stringList.length; i++) {
      var front, rear;
      front = stringList[i].indexOf('href=\"http');
      rear = stringList[i].indexOf(':14501');
      if (front == -1 || rear == -1)
        continue;

      var tempString = stringList[i].substring(front + 6, rear + 6);
      if (tempString.length < 21)
        continue;
      //console.log(count++);
      //console.log(stringList[i]);
      console.log(tempString);

      ServerList[ServerList.length] = tempString;
    }

  }

});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.set('port', process.env.port || 3000);
app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:3000');
});

app.get('/', function(req, res) {
  console.log(req.url);
  res.type('text/html');
  res.sendFile(__dirname + '/public/homepage.html');
});

app.get('/public/*.*', function(req, res) {
  console.log(req.url);
  res.sendFile(__dirname + req.url);
});

app.post('/searchCallSign', function(req, res) {
  console.log(req.url);
  console.log(req.body);

  process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
  });

  try {
    searchSeverLists(0, req.body.CallSign, res);
  } catch (e) {
    console.error(e);
  }

});

function searchSeverLists(ServerItr, CallSign, response) {
    //console.log(response);
    if (ServerItr == ServerList.length) {
      console.log('notFound');
      res.json({
        succ: false
      });
      return;
    }
    console.log(ServerItr + ': ' + ServerList[ServerItr]);
    http.get(ServerList[ServerItr++], function(res) {
      var body = '';
      res.on('data', function(data) {
        console.log(data);
        body += data;
        //console.log(body);
        if (body.search(RegExp('</[Hh][tT][mM][lL]>')) != -1) {
          console.log(body);
          console.log('end of </html>');
          if (body.search(CallSign) == -1)
            searchSeverLists(ServerItr, CallSign, response);
          else {
            console.log('shit found here')
            response.json({
              succ: true,
              ServerLocation: ServerList[ServerItr]
            });
            return;
          }
        }
      });
    }).on('error', function(err) {
      console.error(err);
      searchSeverLists(++ServerItr, CallSign, response);
    });
  }
  //error handler

app.use(function(req, res) {
  console.log(req.url);
  res.type('text/plain');
  res.status(404);
  res.send('4:04 sleep not found');
});

app.use(function(err, req, res, next) {
  console.log(req.url);
  res.type('text/plain');
  res.status(500);
  res.send('500-Server Error');
})
