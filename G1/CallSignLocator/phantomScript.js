var system=require('system');
var page=require('webpage').create();

var url=system.args[1];
//console.log(url);

page.open(url,function (status) {
  //console.log(status);
  if(status==='success'){
    phantom.outputEncoding='utf-8';
    console.log(page.content);

  }
  phantom.exit();
})
