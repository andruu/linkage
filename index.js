var express = require('express');
var bodyParser = require('body-parser')
var useragent = require('express-useragent');
var app = express();
var validator = require('validator');
var Sequelize = require('sequelize');
var redis = require("redis");
var client = redis.createClient();

app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

var Link = sequelize.define('link', {
    url: Sequelize.STRING
});

var Click = sequelize.define('click', {
    linkId: Sequelize.INTEGER,
    ipAddress: Sequelize.STRING,
    referrer: Sequelize.STRING,
    userAgent: Sequelize.STRING
});

// sequelize.drop();
sequelize.sync();

/**
 * Validates URL coming from POST request
 * @param {Object} req
 * @param {Object} res
 * @param {requestCallback} next
 */
var validateUrl = function (req, res, next) {
    var url = req.body.url;

    if (! url) {
        res.status(403).json({ error: 'No url detected' });
    } else if (! validator.isURL(url, {require_protocol: true})) {
        res.status(403).json({error: 'Url not valid: ' + url});
    } else {
        next();
    }
};

/**
 * Checks if short code exists, first checks the cache
 * if code does not exist in cache checks the database.
 * @param {Object} req
 * @param {Object} res
 * @param {requestCallback} next
 */
var shortCodeExists = function (req, res, next) {
    var shortCode = req.params.shortCode;
    var id = getIdFromShortCode(shortCode);
    
    linkFromCache(shortCode, function (err, link) {
        if (err) {
            linkFromDatabase(id, function (err, link) {
                if (err) {
                    res.status(403).json({error: 'Link not found'});
                } else {
                    req.retrievedLink = link;
                    next();
                }
            });
        } else {
            req.retrievedLink = link;
            next();
        }
    });
};

/**
 * Retrieve link from the database
 * @param {integer} id
 * @param {requestCallback} callback
 */
var linkFromDatabase = function (id, callback) {
    Link.findById(id).then(function (link) {
        if (! link) {
            callback(true, null);
        } else {
            callback(null, link.url);
        }
    });
};

/**
 * Retrieve link from the cache
 * @param {integer} id
 * @param {requestCallback} callback
 */
var linkFromCache = function (shortCode, callback) {
    var lookup = 'short-code:' + shortCode;

    client.get(lookup, function (err, link) {
        if (! link) {
            callback(true, null);
        } else {
            callback(null, link);
        }
    });
};

/**
 * Generate short code using base 36 conversion
 * @param {integer} id
 * @return {string}
 */
var generateShortCode = function (id) {
    return id.toString(36);
}

/**
 * Parse shortcode and return ID using base 36 conversion
 * @param {string} shortCode
 * @return {integer}
 */
var getIdFromShortCode = function (shortCode) {
    return parseInt(shortCode, 36);
}


/*
Post via JSON

curl -X "POST" "http://localhost:8888/create" \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"http://www.yahoo.com\"}"

Post via Form

curl -X "POST" "http://localhost:8888/create" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "url=http://www.google.com"
 */
app.post('/create', validateUrl, function (req, res) {
    var url = req.body.url;

    Link.create({url: url}).then(function (link) {
        var shortCode = generateShortCode(link.id);
        var key = 'short-code:' + shortCode;

        client.set(key, url);
        res.json({url: 'http://localhost:8888/' + shortCode});
    });
});

app.get('/:shortCode', shortCodeExists, function (req, res) {
    res.redirect(req.retrievedLink);

    // Although the browser is redirected still working in the background async
    // Would be a smart idea to move to a background process or queue
    Click.create({
        linkId: getIdFromShortCode(req.params.shortCode),
        ipAddress: req.ip,
        referrer: req.get('Referrer'),
        userAgent: req.useragent.source
    }).then(function (click) {
        console.log('Click logged');
    });
});

app.listen(8888, function () {
    console.log('Server started on 8888');
});