var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post('/nameToID',function(req, res) {

    var returnObj = {};
    returnObj.userID = 192939;
    returnObj.userName = 'Doggerdoo';
    res.end(JSON.stringify(returnObj)); //send just the JSON object
    console.log(req.body);
  //  res.send(data);
    //res.send('http://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=http%3A%2F%2Flocalhost%3A4200%2Fverify&openid.realm=http%3A%2F%2Flocalhost%3A4200%2F');
});
app.listen(4200);
console.log('listenin hbhg');
