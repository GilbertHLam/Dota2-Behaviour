var express = require('express'),
    steam   = require('steam-login');

var app = express();
app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
    realm: 'http://localhost:3000/',
    verify: 'http://localhost:3000/verify',
    apiKey: 'C99EAB7D002F75FC3B0FDB694D2EB73C'}
));

app.get('/authenticate', steam.authenticate(), function(req, res) {
    res.redirect('/');
});
app.get('/new', function(req, res){
    logIn();
});
app.get('/verify', steam.verify(), function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ id: req.user.steamid, username: req.user.username }));
});

app.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/', function(req, res) {
  console.log('shit');
        res.sendfile('./public/src/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

function logIn(){
  get('/authenticate', steam.authenticate(), function(req, res) {
      res.redirect('/');
  });
}
app.listen(3000);
console.log('listenin hbhg');
