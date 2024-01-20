var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var express = require('express');
var request = require('request');
var router = express.Router();
const fs = require("fs");
const path = require("path");

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

// Download image to the server
var download = function(url, filename, callback) {
  request.head(url, function(err, res, body) {
    if (err) {
      console.error('Failed to download image:', err);
      return callback(err);
    }
    var filePath = path.resolve(__dirname, '../data/img/' + filename);
    request(url).pipe(fs.createWriteStream(filePath)).on('close', () => {
      console.log('Download complete for:', filename);
      callback(null); // Success
    }).on('error', (error) => {
      console.error('Error during download:', error);
      callback(error); // Error during download
    });
  });
};

router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { cakes: JSON.parse(data) });
});

router.post('/', jsonParser, function(req, res, next) {
  const expectedAttributed = ["url", "name", "alt", "category", "header", "description"];
  Object.keys(req.body).forEach(param => {
      if (!(expectedAttributed.includes(param))) {
          res.status(400).end("Wrong Atr");
      } else {
          if (req.body[param] == ''){
              res.status(400).end(param + " must have a value");
          }
      }
  });
  if (req.body.url == null || req.body.name == null) {
      res.status(400).end("Url/name not provided");
  }
  if (req.body.category != null) {
      if (!["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category)) {
          res.status(400).end("Wrong category provided");
      }
  }
});


router.delete('/', jsonParser, ensureLoggedIn, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
  if(newArray.length !== portfoliosArray.length) {
    fs.unlink(path.resolve(__dirname, '../data/img/'+ req.body.name), () => {
      console.log(req.body.name + " deleted!");
    });
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

module.exports = router;
