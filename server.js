var express = require('express');
var bodyParser = require('body-parser');
var https = require("https");
var app = express();
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var strint = require("./strint");
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

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
      console.log(profile._json.personaname + " wants their steam ID! We've returned it as " + profile._json.steamid);
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
    res.redirect('http://localhost:3000/id/'  + '');
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
  //console.log(options.host+options.path);
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
        for(var i = 0; i < matchIDs.length; i++){
        retrieveChatLogs(matchIDs[i], steamUser);
      }


    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    console.log("Error finding matches! User may not exist or there is a problem with the connection. Returning error to the client");
  });
  req.end();
});

function sentimentAnalysis(arrayOfMessages){

}

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
  //console.log(options.host + options.path);
  var req = https.get(options, function(res) {
    var content = ''
    res.on("data", function (chunk) {
          content += chunk;
    })
    res.on("end",function (){

        var obj = JSON.parse(content);
        //console.log(obj.chat);
        if(obj != null) {
        var chatLog = obj.chat;
        //console.log(chatLog);
        for(var i = 0; i < chatLog.length; i++){
          if(chatLog[i].type == 'chat' && chatLog[i].unit == steamUser){
            messages.push(chatLog[i].key);
            console.log(steamUser + ' said "' + chatLog[i].key + '" in match ' + matchID);
          }
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
