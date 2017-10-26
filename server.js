var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.post('/nameToID',function(req, res) {

  var returnObj = {};
  returnObj.userID = findSteamID(req.body.userName);
  returnObj.userName = req.body.userName;
  res.end(JSON.stringify(returnObj)); //send just the JSON object
});

function findSteamID(UserName){
  var options = {
    host: 'steamcommunity.com',
    port: 80,
    path: '/id/' + UserName
  };
  var steamID = 0;
  var content = "";
  http.get(options, function(res) {
    res.on("data", function (chunk) {
          content += chunk;
    })
    res.on("end",function (){
      var tempArray0 = content.split("steamid\":");

      var tempArray = tempArray0[1].split(",\"personaname");
      steamID = tempArray[0].replace(/['"]+/g, '');
      steamID = parseInt(steamID);
      //console.log("CONTENT:" + content);
      console.log(UserName , "wants their steam ID! We've sent it back as", steamID);
      return steamID;
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  console.log(content);


}
app.listen(4200);
console.log('Server started, listening now');
