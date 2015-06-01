var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var server = app.listen(3000, function() {
  console.log("Server has started.");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/moving_object", function(req, res) {
  //var str = URLDecoder.decode(res.body,"utf-8");
  console.log(req.body);
  console.log("haha");
  res.send({msg:'Yes, He is handsome!'});
});

app.post("/weather", function(req, res) {
  //var str = URLDecoder.decode(res.body,"utf-8");
  console.log(req.body);
  console.log("haha");
  res.send({msg:'Yes, He is handsome!'});
});
