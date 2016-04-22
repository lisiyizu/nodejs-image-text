"use strict";

var imagetext = require("./imagetext");

(function() {

    var textItems = {
        northeast: "",
        northwest: "NorthWest",
        southeast: "This is the SouthEast",
        southwest: "This is the southern and western item",
        center: "In the middle"
    };
    imagetext.addAllText("c:/temp/1.JPG", "c:/temp/1-modified.JPG", textItems, "#f60");

})();
