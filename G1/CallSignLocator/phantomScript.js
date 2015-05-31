var system = require('system');
var page = require('webpage').create();

var url = system.args[1];
//console.log(url);

var t = Date.now();
page.settings.recourseTimeout = 5000; //set Timeout 5s
page.onResourceTimeout = function(e) {
  console.log(e.errorCode);
  console.log(e.errorString);
  console.log(e.url);
  phantom.exit();
}
page.open(url, function(status) {
  //console.log(status);
  if (status === 'success') {
    phantom.outputEncoding = 'utf-8';
    console.log(page.content);
    t = Date.now() - t;
    //console.log(url+': '+t);
  } else {
    console.log('failed');
  }
  phantom.exit();
})
