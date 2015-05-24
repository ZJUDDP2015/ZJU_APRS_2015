var fs = require("fs");

function file_write(content, file, myDate) {
  fs.open(file,'a',function open(err,fd){
    if(err){throw err;}
    var writeBuffer=new Buffer('['+myDate.toUTCString()+']'+content);
    var bufferPosition=0;
    var bufferLength=writeBuffer.length;
    var fileposition=null;
    fs.write(fd,
      writeBuffer,
      bufferPosition,
      bufferLength,
      fileposition,
      function wrote(err,written){
        if(err) {throw err;}
        console.log('wrote'+written+'byte');
        fs.closeSync(fd);
      });
  });
}

exports.file_write = file_write;
