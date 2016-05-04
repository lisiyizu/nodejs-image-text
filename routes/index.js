var express = require('express');
var path = require("path");
var fs = require("fs-extra");

var router = express.Router();

var imagetext = require("../imagetext");

var inputDir = path.join(
    path.join(
        path.dirname(require.main.filename), 
        "public"
    ),
    "inputimages"
);

var outputDir = path.join(
    path.join(
        path.dirname(require.main.filename),
        "public"
    ),
    "outputimages"
);

/* GET home page. */
router.get('/', function(req, res, next) {
      res.render('index', { 
          title: 'Image Text Maker'
      });
});


router.post("/index/post-file", function(req, res, next) {
    var fileName = path.join(inputDir, req.body.fileName);
    var resultingFileName = path.join(outputDir, req.body.fileName);
    var textItems = {
        northwest: req.body.northwest,
        northeast: req.body.northeast,
        southwest: req.body.southwest,
        southeast: req.body.southeast,
        center: req.body.center
    };
    
    imagetext.addAllText(fileName, resultingFileName, textItems, "#f60", function() {
        res.json({success:true});
    });
});

router.post("/index/get-image-date", function(req, res, next) {
    var fileName = path.join(inputDir, req.body.fileName);
    
    imagetext.getFormattedImageDate(fileName, function(data) {
        res.json(data);
    });
});

router.get("/index/get-files", function(req, res, next) {
    fs.readdir(inputDir, function(err, files) {
        if (err) {
            console.error(err);
            return;
        }
        
      var fileInfos = [];
      var stats;
      files.forEach(function(file) {
          var isDone;
          try {
              stats = fs.lstatSync(path.join(outputDir, file));
                isDone = stats.isFile();
          } catch (ex) {
            isDone = false;
          }
          fileInfos.push({isDone: isDone, fileName: file});
      });

      res.render('filelist', { 
          files: fileInfos
      });
    });
});

module.exports = router;
