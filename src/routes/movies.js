var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
const globals = require("../globals");

/* GET fifty movie and tv show entries. */
router.get('/', function (req, res, next) {
    let client = globals.get("CLIENT");
    const collection = client.db("Netflix-titles").collection("titles");

    // collection
    //     .find({})
    //     .limit(50)
    //     .toArray()
    //     .then((results) => {
    //         results.forEach((element, i, returnArray) => returnArray[i] = element);
    //         return res.send(results);
    //     });

    collection
        .aggregate([
            { $sample: { size: 50 } }
        ])
        .toArray()
        .then((results) => {
            results.forEach((element, i, returnArray) => returnArray[i] = element);
            return res.send(results);
        });
});

/* GET by genre. */
router.get('/:genre', function (req, res, next) {
    if (!req.params["genre"]) {
        return res.notFound("Missing required parameter(s).");
    }

    let client = globals.get("CLIENT");
    const collection = client.db("Netflix-titles").collection("titles");
    const genre = req.params["genre"];

    collection
        .find({ $text: { $search: genre }, type: "Movie" })
        .toArray()
        .then((results) => {
            results.forEach((element, i, returnArray) => returnArray[i] = element);
            return res.send(results);
        });
});

module.exports = router;