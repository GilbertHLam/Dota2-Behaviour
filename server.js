require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var app = express();
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var strint = require("./strint");
var passport = require('passport');


var async = require('async');
var SteamStrategy = require('passport-steam').Strategy;
var steamID;

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
  apiKey: process.env.STEAM_KEY
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

app.post('/findRecentMatches',function(req, specRes) {
  var asyncTasks = [];

  var numOfGame = req.body.limit;
  var steamID = req.body.userID;
  console.log(steamID + " has asked for their recent games, finding now...");
  var nickName;
  var matchIDs = [];
  var messages = [];
  var counter = 0;
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
      for(var i = 0; i < matchIDs.length; i++){
    //    sleep(0.1);
        retrieveChatLogs(matchIDs[i], steamID, messages, specRes, function(err, response, specRes) {
          if(err){
            console.log("RIP");
          }
          counter = counter + response;
          //console.log(counter);
          if(counter == matchIDs.length){
            return sentimentAnalysis(messages, specRes);
          }
        });
      }

    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
    });
    req.end();
  });
});

var logError = function(err) { console.log(err); }

function sentimentAnalysis(arrayOfMessages, res){
  //console.log(res);
//console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  var returnObj = {};
  var content = {
    "document": {
      "type": "PLAIN_TEXT",
      "language": "en",
      "content": arrayOfMessages.join('. '),
    },
    encodingType: "UTF16",
  };
  var options = {
    method: 'POST',
    host: 'language.googleapis.com',
    port: 443,
    body: content,
    headers: {
    'Content-Type': 'application/json',
    },
    path: '/v1/documents:analyzeSentiment?key=' + process.env.GOOGLE_APPLICATION_CREDENTIALS,
  };
  var req = https.request(options, function(response) {
    var tempString = '';
    response.on('data', function(chunk) {
      //console.log(chunk);
      tempString += chunk;
    }).on("end", function(){
      var obj = JSON.parse(tempString);
    //  console.log(obj);
    //  console.log(arrayOfMessages.join(' . '));
      var tempMess = [];
      var tempScore = [];
      for(var p = 0; p < obj.sentences.length; p ++) {
        tempMess[p] = obj.sentences[p].text.content ;
        tempScore[p] = obj.sentences[p].sentiment.score;//+obj.sentences[p].sentiment.magnitude;
      }
      var mostPositive;
      var mostPosIndex = 0;
      var mostNegIndex = 0;
      var mostNegative;
      var averageScore = 0;
      mostPositive = tempScore[0];
      mostNegative = tempScore[0];
      for(var i = 0; i < tempScore.length;i++){
      if(mostPositive < tempScore[i]) {
      mostPositive = tempScore[i];
      mostPosIndex = i;
    }
    if(mostNegative > tempScore[i]) {
    mostNegative = tempScore[i];
    mostNegIndex = i;
    }
    averageScore += tempScore[i];
    }
    averageScore = averageScore*100/tempScore.length;
    console.log("Most Negative: '" + tempMess[mostNegIndex] + "' with a score of " + mostNegative*100 +"%");
    console.log("Most Positive: '" + tempMess[mostPosIndex] + "' with a score of " + mostPositive*100 +"%");
    console.log("Average Score: " + averageScore);
    returnObj.mostNeg = tempMess[mostNegIndex];
    returnObj.mostNegScore = mostNegative*100;
    returnObj.mostPos = tempMess[mostPosIndex];
    returnObj.mostPosScore = mostPositive*100;
    returnObj.averageScore = averageScore;
    return res.end(JSON.stringify(returnObj));
    });

  }).on('error', function(e){
    console.log("error:", e);
  });
  req.write(JSON.stringify(content));
  req.end();
  /**

**/

}

function retrieveChatLogs(matchID, steamID, messages, specialRes, callback){
  var nickName;
  var err;
  var options = {
    host: 'api.opendota.com',
    path: '/api/matches/' + matchID,
    port: 443,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var req = https.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
      try{
        content += chunk;
      }catch(err){
        console.log(err);
      }
    });
    res.on("end",function (){
      //console.log("Looking at match " + matchID + " for user " + steamID);
      try {
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
              if(chatLog[i].type == 'chat' && chatLog[i].unit == nickName && !(chatLog[i].key == 'gg' || chatLog[i].key =='GG' || chatLog[i].key =='Gg')){
                messages.push(chatLog[i].key);
                console.log(nickName + ' said "' + chatLog[i].key + '" in match ' + matchID);
              }
            }
            callback(err, 1, specialRes);
          }
          else {
            callback(err, 1, specialRes);
          }
        }
      }catch(err){
        callback(err, 1, specialRes);
      }
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
    });
  });
}


function addToList(messages, messageList){
  return messageList.concat(messages);
}
app.listen(4200);
console.log('Server started, listening now');
