var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var ServerList = new Array();

var CallSignList = new Array;
var CallSignCount = 0;

console.log(binPath);
var childArgs = [
  path.join(__dirname, '/phantomScript.js'),
  'http://status.aprs2.net' //,
  //'–load-images=false',
  //'–disk-cache=true'
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

  var count = 0;
  var Found = false;
  for (var i = 0; i < ServerList.length; i++) {
    var T2Server = ServerList[i];
    var Cmd = binPath + ' phantomScript.js ' + T2Server;
    var option = {
      timeout: 115000,
      killSignal: 'SIGTERM'
    }

    childProcess.exec(Cmd, option, function(err, stdout, stderr) {
      count++;
      console.log('we got shit here: ' + count + '/' + ServerList.length);
      if (!Found && count == ServerList.length) {
        res.json({
          succ: false
        });
        console.log('false->res sent');
      }
      if (err) {
        console.error(err);
      }
      if (stderr) {
        console.error(stderr);
      }
      if (stdout) {
        //console.log(stdout);
        if (!Found && stdout.search(req.body.CallSign) != -1) {
          Found = true;
          res.json({
            succ: true,
            ServerLocation: T2Server
          });
        }
      }
    });

  }

});

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
