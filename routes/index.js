var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  // Read introductionArray.json
  let introData = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"), "utf8");
  let introArray = JSON.parse(introData);

  // Read recommendations.json
  let recommendationsData = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"), "utf8");
  let recommendations = JSON.parse(recommendationsData);

  // Read portfolio.json
  let portfolioData = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"), "utf8");
  let cakes = JSON.parse(portfolioData);

  // Pass all data sets to the view
  res.render('index', { 
    title: 'Express',
    array: introArray,
    recommendations: recommendations,
    cakes: cakes // adding cakes data
  });
});

module.exports = router;