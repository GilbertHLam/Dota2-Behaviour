var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var strint = require("./strint");
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.post('/nameToID',function(req, response) {

  var returnObj = {userID: "", userName: ""};
  var options = {
    host: 'steamcommunity.com',
    port: 80,
    path: '/id/' + req.body.userName
  };
  var steamID = "";
  var content = "";
  http.get(options, function(res) {
    res.on("data", function (chunk) {
          content += chunk;

    })
    res.on("end",function (){
      var tempArray0 = content.split("steamid\":");
      var tempArray = tempArray0[1].split(",\"personaname");
      steamID = tempArray[0].replace(/['"]+/g, '');

      steamID = strint.sub(steamID, "76561197960265728");
      console.log(req.body.userName , "wants their steam ID! We've sent it back as", steamID);
      returnObj.userID = steamID;
      returnObj.userName = req.body.userName;
      response.end(JSON.stringify(returnObj)); //send just the JSON object
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error! User may not exist or there is a problem with the connection. Returning error to the client");
  });

});

app.post('/findRecentMatches',function(req, res) {
  var numOfGame = req.body.limit;
  var steamID = req.body.userID;
  var matchIDs = [];
  var options = {
      host:'api.opendota.com',
      paths: '/api/players/' + steamID + '/matches?limit=' + numOfGame
  };
  console.log(options.host+options.paths);
  http.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
          content += chunk;
          console.log(chunk);
    })
    res.on("end",function (){
      console.log(content);
        var obj = JSON.parse(content);
        for(var i = 0; i < obj.length; i++){
          matchIDS.append(obj[i].match_id);
          console.log(obj[i].match_id);
        }
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error! User may not exist or there is a problem with the connection. Returning error to the client");
  });

});

function findSteamID(UserName){



}
app.listen(4200);
console.log('Server started, listening now');
