const { MongoClient } = require('mongodb');
const { MONGO_URL, MONGO_OPTIONS } = require("./databaseConfig");


/**
 * @name connect
 * @summary Connect to Mongo
 * @param {string} url - URL connections string for mongo
 * @param {Object} options - Any options for Mongo
 * @return {Promise}
 */
let mongoClient;
let connect = (url, options) => new Promise((resolve, reject) => {
    let connStringUrl = url || MONGO_URL;
    let connStringOptions = options || MONGO_OPTIONS;

    if(mongoClient){
        return resolve(mongoClient);
    }

	// Connect to mongo
	MongoClient.connect(connStringUrl, connStringOptions, (err, client) => {
        if (err) { return reject(err); }
        
        mongoClient = client;
		return resolve(mongoClient);
	});

});


module.exports = connect;
