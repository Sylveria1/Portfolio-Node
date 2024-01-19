var express = require('express');
var request = require('request');
var router = express.Router();
const fs = require("fs");
const path = require("path");

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

router.post('/', express.json(), function(req, res) {
  let rawData = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawData);

  if (!portfoliosArray.some(x => x.name === req.body.name)) {
    download(req.body.url, req.body.name, function(error) {
      if (error) {
        return res.status(500).send('Failed to download image');
      }
      portfoliosArray.push(req.body);
      fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(portfoliosArray));
      res.status(200).send('Image added to portfolio');
    });
  } else {
    res.status(400).send('Image already exists');
  }
});

router.delete('/', express.json(), function(req, res, next) {
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
