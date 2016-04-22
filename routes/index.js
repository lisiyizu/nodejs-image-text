var express = require('express');
var path = require("path");
var fs = require("fs-extra");

var router = express.Router();

var inputDir = path.join(
    path.join(
        path.dirname(require.main.filename), 
        "public"
    ),
    "inputimages"
);

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readdir(inputDir, function(err, files) {
      res.render('index', { 
          title: 'Image Text Maker', 
          query: req.query,
          files: files
      });
    });
});

module.exports = router;
