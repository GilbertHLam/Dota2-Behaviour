var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");

var app = express();
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
  var steamUser = req.body.userName;
  var matchIDs = [];
  var options = {
      host: 'api.opendota.com',
      path: '/api/players/' + steamID + '/matches?limit=' + numOfGame,
      port: 443,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
  };
  console.log(options.host+options.path);
  var req = https.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
          content += chunk;
    })
    res.on("end",function (){
        var obj = JSON.parse(content);
        for(var i = 0; i < obj.length; i++){
          matchIDs.push(obj[i].match_id);
        }
        retrieveChatLogs(matchIDs[0], steamUser);

    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  req.end();
});

function retrieveChatLogs(matchID, steamUser){
  var messages = [];
  var options = {
      host: 'api.opendota.com',
      path: '/api/matches/' + matchID,
      port: 443,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
  };
  console.log(options.host + options.path);
  var req = https.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
          content += chunk;
    })
    res.on("end",function (){

        var obj = JSON.parse(content);
        var chatLog = obj.chat;
        for(var i = 0; i < chatLog.length; i++){
          if(chatLog[i].type === 'chat' && chatLog[i].unit === steamUser){
            messages.push(chatLog[i].key);
            console.log(chatLog[i].key)
          }
        }
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  req.end();
}
app.listen(4200);
console.log('Server started, listening now');
