var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var app = express();
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var strint = require("./strint");
var passport = require('passport');
var indico = require('indico.io');
var async = require('async');
var SteamStrategy = require('passport-steam').Strategy;
var steamID;
indico.apiKey =  'f759097f01407bd1302f6caad8cf62d0'
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:4200/auth/steam/return',
  realm: 'http://localhost:4200/',
  apiKey: 'C99EAB7D002F75FC3B0FDB694D2EB73C'
},
function(identifier, profile, done) {
  profile.identifier = identifier;
  //console.log(identifier);
  //console.log(profile);

  steamID =profile._json.steamid;
  steamID = strint.sub(steamID, "76561197960265728");
  console.log(profile._json.personaname + " wants their steam ID! We've returned it as " + steamID);
  done(null, profile);
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/steam',
passport.authenticate('steam'),
function(req, res) {
  // The request will be redirected to Steam for authentication, so
  // this function will not be called.
});

app.get('/auth/steam/return',
passport.authenticate('steam', { failureRedirect: '/auth/steam' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('http://localhost:3000/id/'  + steamID);
});

app.post('/findRecentMatches',function(req, res) {
  var asyncTasks = [];

  var numOfGame = req.body.limit;
  var steamID = req.body.userID;
  console.log(steamID + " has asked for their recent games, finding now...");
  var nickName;
  var matchIDs = [];
  var messages = [];
  var options = {
    host: 'api.opendota.com',
    path: '/api/players/' + steamID + '/matches?limit=' + numOfGame,
    port: 443,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
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
      var listLength = matchIDs.length;
    //  for(var i = 0; i < listLength; i++){
        retrieveChatLogs(matchIDs, steamID, messages, 0, listLength);

  //    }

      //setTimeout(function(){console.log(messages);sentimentAnalysis(messages);}, 10000);



  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  req.end();
});
});
function addMessages(messages, i ,steamID){

    //callback();
}

var response = function(res) {
  console.log("YOUR SCORE IS " + res);
}
var logError = function(err) { console.log(err); }

function sentimentAnalysis(arrayOfMessages){
  indico.sentiment(arrayOfMessages)
  .then(response)
  .catch(logError);
}

function retrieveChatLogs(matchIDs, steamID, messageList, currentMatch, listLength){
  var nickName;
  var messages = [];
  var options = {
    host: 'api.opendota.com',
    path: '/api/matches/' + matchIDs[currentMatch],
    port: 443,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var req = https.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
      content += chunk;
    })
    res.on("end",function (){
      console.log("Looking at match " + matchIDs[currentMatch] + " for user " + steamID);
      var obj = JSON.parse(content);
      if(obj.players != null) {
        var tempArray = obj.players;
        for(var i = 0; i < 10; i++){
          if(tempArray[i].account_id == steamID)
          nickName = tempArray[i].personaname;
        }

        var chatLog = obj.chat;
        if(chatLog != null){
          for(var i = 0; i < chatLog.length; i++){
            if(chatLog[i].type == 'chat' && chatLog[i].unit == nickName && chatLog[i].key != 'gg'){
              messages.push(chatLog[i].key);
              console.log(nickName + ' said "' + chatLog[i].key + '" in match ' + matchIDs[currentMatch]);
            }
          }


          if(currentMatch == listLength - 1){
            console.log("------------------------------");
            console.log(messageList);
            return sentimentAnalysis(messageList);
          }
          else {
            messageList = addToList(messages, messageList);
            currentMatch++;
            return retrieveChatLogs(matchIDs, steamID,messageList,currentMatch,listLength);
          }
        }
      }
    //  else {
        currentMatch++;
        return retrieveChatLogs(matchIDs, steamID,messageList,currentMatch,listLength);
    //  }
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  req.end();
}

function addToList(messages, messageList){
  return messageList.concat(messages);
}
app.listen(4200);
console.log('Server started, listening now');
