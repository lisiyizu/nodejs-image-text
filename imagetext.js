"use strict";

var fs = require("fs-extra");
var imagemagick = require("imagemagick");
var path = require("path");

function getOptions(imageData, source, options) {

	if (!options.color) {
		throw new Error("color is required");
	}

	if (!options.text) {
		throw new Error("text is required");
	}

	if (!options.position) {
		throw new Error("position is required");
	}

	var divider = options.text.length;

	if (divider < 12) {
		divider = 12;
	}

	var pointsize = imageData.width / divider;

	var args = [];
	args.push(source);
	args.push('-size');
	args.push(imageData.width + 'x' + imageData.height);
	if (options.font) {
		args.push('-font');
		args.push(options.font);
	}
	args.push('-fill');
	args.push(options.color);
	args.push('-pointsize');
	args.push(pointsize);
	args.push('-gravity');
	args.push(options.position);
	args.push('-annotate');
	args.push(0);
	args.push(options.text);
	args.push(source);

	return args;
}

/*
    fileName: the file name (full) - this will overwrite this file!
    options: { color: "#f60", text: "Some Text", position: "northwest" }
    callback: after this change has been made
*/
function addText(fileName, options, callback) {

	if (!fileName) {
		throw new Error("fileName is required");
	}
	
	var stats = fs.lstatSync(fileName);
	if (!stats.isFile()) {
		throw new Error("source image not found");		
	}

	imagemagick.identify(fileName, function (err, imageData) {
		if (err) {
			throw new Error(err);
		}

		var imArgs = getOptions(imageData, fileName, options);

		imagemagick.convert(imArgs, function(err) {
			if (err) {
				throw new Error(err);
			} else { 
				console.log("File available at: ", fileName);
				if (typeof callback === "function") {
					callback();
				}
			}
		});
	});
}

/*
    fileName: the original file name (full)
    resultingFileName: the new file name (full)
    textItems: { northeast: "Some Text", southwest: "More Text", center: "Even More" }
    color: #f60
    callback: after all changes have been made
*/
function addAllText(fileName, resultingFileName, textItems, color, callback) {
    color = color || "#f60";

    var queue = [];
    
    if (textItems.northeast) {
        queue.push({ position: "northeast", text: textItems.northeast });
    }
    if (textItems.northwest) {
        queue.push({ position: "northwest", text: textItems.northwest });
    }
    if (textItems.southeast) {
        queue.push({ position: "southeast", text: textItems.southeast });
    }
    if (textItems.southwest) {
        queue.push({ position: "southwest", text: textItems.southwest });
    }
    if (textItems.center) {
        queue.push({ position: "center", text: textItems.center });
    }

    var go = function() {
        var item = queue.splice(0, 1)[0];
        if (!item) {
            if (typeof callback === "function") {
                callback();
            }
            return;
        }
        
        addText(resultingFileName, {
            color: color,
            position: item.position,
            text: item.text
        }, go);
    };
    
    fs.copy(fileName, resultingFileName, go);
}

exports = module.exports = { 
    addText: addText,
    addAllText: addAllText 
};
