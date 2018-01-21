//===========================================================================================
require('dotenv').config();
var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');
var valvelet = require('valvelet');
var https = require("https");
var app = express();
var http = require('http');
var admin = require("firebase-admin");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var strint = require("./strint");
var passport = require('passport');
var async = require('async');
var SteamStrategy = require('passport-steam').Strategy;
//===========================================================================================
var serviceAccount = require("./userID.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dota2-189419.firebaseio.com/"
});
var db = admin.database();
var ref = db.ref("/");
//===========================================================================================
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
//===========================================================================================




//===========================================================================================
app.post('/findRecentMatches',function(req, specRes) {
  var asyncTasks = [];

  var numOfGame = req.body.limit;
  var steamID = req.body.userID;
  ref.child(steamID).once('value')
    .then(function (result) {
      console.log(result.val());
      if(result.val() != null){
        specRes.json(result);
        specRes.end();
      }
      else {
        console.log(steamID + " has asked for their recent games, finding now...");
        var nickName;
        var matchIDs = [];
        var matches = [];
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
            var asyncFunction = valvelet(function request(matchID, steamID, matches, specRes, func){
              retrieveChatLogs(matchID, steamID, matches, specRes, func);
            },5, 1000);
            for(var i = 0; i < matchIDs.length; i++){
              asyncFunction(matchIDs[i], steamID, matches, specRes, function(err, response, specRes) {
                if(err){
                  console.log(err);
                }
                counter = counter + 1;
                //console.log(matches);
                console.log('Done ' + counter + ' out of ' + matchIDs.length);
                if(counter == matchIDs.length){
                  return analyzeMatches(matches, specRes, steamID);
                }
              });
            }

          }).on('error', function(e) {
            console.log("Got error: " + e.message);
            console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
          });
          req.end();
        });
      }
    })
    .catch(function (err) {
      // This is where errors land
      console.log('Error', err.code);
    });



  });

  var logError = function(err) { console.log(err);}


function analyzeMatches(matches, specRes, steamID){
  var counter = 0;
  for(var i = 0; i < matches.length; i++){
    //console.log(matches[i].messages);
    sentimentAnalysis(matches[i], specRes, steamID, matches, function( matches, steamID, matchObj, returnObj){
      counter++;
      matchObj.messages = returnObj.messages;
      if(counter == matches.length)
        writeToFirebase(steamID, matches, specRes);
    });
  }
}

function writeToFirebase(steamID, matchesObj,specRes){
  //console.log(matchesObj);
  var writeObj = {};
  var mostPositive;
  var averageScore = 0;
  var mostNegative;
  var totalMessages = 0;
  var negativeMessages = 0;
  var positiveMessages = 0;
  var neutralMessages = 0;
  var counter = 0;

  mostPositive = matchesObj[0].messages[0];
  mostNegative = matchesObj[0].messages[0];
  for(var i = 0; i < matchesObj.length;i++){
    for(var x = 0; x < matchesObj[i].messages.length;x++){
      totalMessages++;
      if(matchesObj[i].messages[x].score > 0){
        positiveMessages++;
      }
      else if(matchesObj[i].messages[x].score < 0){
        negativeMessages++;
      }
      else {
        neutralMessages++;
      }
      averageScore = averageScore + matchesObj[i].messages[x].score;
      if(matchesObj[i].messages[x].score > mostPositive.score){
        mostPositive = {message : matchesObj[i].messages[x].message, score : matchesObj[i].messages[x].score, matchIndex:i} ;
      }
      else if(matchesObj[i].messages[x].score < mostNegative.score){
        mostNegative = {message : matchesObj[i].messages[x].message, score : matchesObj[i].messages[x].score, matchIndex:i};
      }
      counter++;
    }
  }
  averageScore = averageScore*1000/counter;
  console.log("Most Positive: '" + mostPositive.message + "' with a score of " + mostPositive.score );
  console.log("Most Negative: '" + mostNegative.message + "' with a score of " + mostNegative.score);
  console.log("Average Score: " + averageScore);
  var options = {
    host: 'api.opendota.com',
    path: '/api/players/' + steamID,
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
      writeObj.name = obj.profile.personaname;
      writeObj.image = obj.profile.avatarfull;
      writeObj.matches = matchesObj;
      writeObj.mostPositive = mostPositive;
      writeObj.mostNegative = mostNegative;
      writeObj.averageScore = averageScore.toFixed(1);;
      writeObj.negativeMessages = negativeMessages;
      writeObj.positiveMessages = positiveMessages;
      writeObj.neutralMessages = neutralMessages;
      writeObj.totalMessages = totalMessages;
      var userDB = ref.child(steamID);
      userDB.set(writeObj);
      ref.child(steamID).once('value')
        .then(function (result) {
          specRes.json(result);
          specRes.end();
        });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
    });
    req.end();
  });


}
function checkIfInDB(steamID){
  var urlRef = ref.child("/"+steamID);
  urlRef.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      console.log(child.key);
      return true;
    });
  });

}
function sentimentAnalysis(match, res, steamID, matches,callback){
  //console.log(messagesList);
  var returnObj = {};
  var content = {
    "document": {
      "type": "PLAIN_TEXT",
      "language": "en",
      "content": match.messages.join('. '),
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
      returnObj.messages = [];

      for(var p = 0; p < obj.sentences.length; p ++) {
        var tempMsgObj = {};
        tempMsgObj.message = obj.sentences[p].text.content ;
        console.log("Message: " + obj.sentences[p].text.content);
        console.log("Score: " + obj.sentences[p].sentiment.score);
        console.log("Mag: " + obj.sentences[p].sentiment.magnitude);
        tempMsgObj.score = obj.sentences[p].sentiment.score;
        returnObj.messages.push(tempMsgObj);
      }
      callback(matches, steamID, match, returnObj);
    });

  }).on('error', function(e){
    console.log("error:", e);
  });
  req.write(JSON.stringify(content));
  req.end();


}

function retrieveChatLogs(matchID, steamID, matches, specialRes, callback){
  var nickName, won, team, deaths,kills,assists,kda,team,direScore,radiantScore,duration,inParty,date, heroID;
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
            if(tempArray[i].account_id == steamID){
              nickName = tempArray[i].personaname;
              won = tempArray[i].win;
              deaths = tempArray[i].deaths;
              kills = tempArray[i].kills;
              assists = tempArray[i].assists;
              kda = tempArray[i].kda;
              heroID = tempArray[i].hero_id;
              if(tempArray[i].party_size)
              inParty = true;
              else
              inParty = false;
              if(tempArray[i].isRadiant == 0)
              team = 'Dire';
              else {
                team = 'Radiant';
              }
            }
          }
          var arrayOfMessagesThisMatch = [];
          duration = obj.duration;
          date = moment.unix(obj.start_time).format('dddd, MMMM Do, YYYY');
          direScore = obj.dire_score;
          radiantScore = obj.radiant_score;
          var chatLog = obj.chat;
          if(chatLog != null){
            for(var i = 0; i < chatLog.length; i++){
              if(chatLog[i].type == 'chat' && chatLog[i].unit == nickName ){
                arrayOfMessagesThisMatch.push(chatLog[i].key);
                console.log(nickName + ' said "' + chatLog[i].key + '" in match ' + matchID);
              }
            }
            if(arrayOfMessagesThisMatch.length == 0){
              console.log("NONE");
              callback(err,matchID,specialRes);
            }
            else {
            matches.push({messages:arrayOfMessagesThisMatch,username: nickName,won:won, team:team,deaths:deaths,kills:kills, assists:assists, kda:kda, team:team,direScore:direScore,radiantScore:radiantScore,duration:duration,inParty:inParty,date:date, heroID:heroID,matchID:matchID});
            callback(err, matchID, specialRes);
          }
          }
          else {
            callback(err, matchID, specialRes);
          }
        }
      }catch(err){
        console.log(err);
        callback(err, matchID, specialRes);
      }
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
    });
    res.on('error', function(e) {
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
