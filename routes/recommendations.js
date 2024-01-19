var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { data: JSON.parse(data)
 });
});


/* Post Request. */
router.post('/', jsonParser, function(req, res, next) {
  const expectedAttributed = ["avatar", "name", "role", "description"];
  Object.keys(req.body).forEach(param => {
      if (!(expectedAttributed.includes(param))) {
          console.log(param);
          res.status(400).end("Wrong Attr");
      } else {
          if (req.body[param] == '') {
              res.status(400).end(param + " must have a value");
          }
      }
  });
  if (req.body.avatar == null || req.body.name == null) {
      res.status(400).end("Avatar/name not provided");
  }
  if (!([1, 2, 3].includes(req.body.avatar))) {
      res.status(400).end("Wrong avatar provided")
  }
})


/* Delete Request. */
router.delete('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);
  const newArray = recommendationsArray.filter(x => x.name !== req.body.name)
  if (newArray.length !== recommendationsArray.length ) {
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
  }
  res.end();
});

module.exports = router;