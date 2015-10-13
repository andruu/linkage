/*
Creating new links

Post via JSON

curl -X "POST" "http://localhost:3000/create" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"http://www.yahoo.com\"}"

Post via Form

curl -X "POST" "http://localhost:3000/create" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "url=http://www.google.com"
*/

var express    = require('express');
var bodyParser = require('body-parser')
var useragent  = require('express-useragent');
var app        = express();
var models     = require("./models");
var middlewear = require("./middlewear");
var services   = require("./services");

app.set('port', process.env.PORT || 3000);
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/create', middlewear.validateUrl, function (req, res) {
  var url = req.body.url;

  services.createLink(url, function (err, shortCode) {
    res.json({url: 'http://localhost:' + app.get('port') + '/' + shortCode});
  });
});

app.get('/:shortCode/stats', middlewear.shortCodeExists, function (req, res) {
  var shortCode = req.params.shortCode;
  var link      = req.retrievedLink;

  services.getStats(shortCode, link, function (err, stats) {
    res.json(stats);
  });
});

app.get('/:shortCode', middlewear.shortCodeExists, function (req, res) {
  res.redirect(req.retrievedLink);

  // This happens after the redirect async, should be put into background task or queue
  services.createClick(req.params.shortCode, req.ip, req.get('Referrer'), req.useragent.source, function (err, click) {
    console.log(click.id);
  });
});

models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function () {
    console.log('Server started on ' + app.get('port'));
  });
});