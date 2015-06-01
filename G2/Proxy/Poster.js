var http = require("http");

function SendtoDB(object, url){
    var req=http.request({
        hostname: "localhost",
        port: 3000,
        method: "post",
        path: url,
        headers:{
            'Content-Type':"application/json"
        }
    }, function(res){
       //console.log(url + ' Sent');
    });
    req.on('error', function(e) { 
	console.log('problem with request: ' + e.message); 
    });
    req.write(JSON.stringify(object));
    req.end();
}

exports.SendtoDB = SendtoDB;
