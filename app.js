var express    = require('express');
var bodyParser = require('body-parser');
var useragent  = require('express-useragent');
var models     = require("./models");
var middlewear = require("./middlewear");
var services   = require("./services");
var app        = exports.app = express();

app.set('port', process.env.PORT || 3000);
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/create', middlewear.validateUrl, function (req, res) {
  var url  = req.body.url;
  var host = req.protocol + '://' + req.get('host');

  services.createLink(url, function (err, shortCode) {
    res.json({url: host + '/' + shortCode});
  });
});

app.get('/links', function (req, res) {
  var host = req.protocol + '://' + req.get('host');

  services.getLinks(host, function (err, links) {
    res.json(links);
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
  services.createClick(req.params.shortCode, req.ip, req.get('Referrer'), req.useragent.source, function (err, click) {});
});

models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function () {
    console.log('Server started on ' + app.get('port'));
  });
});
