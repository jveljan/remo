var config = {
	host: 'localhost',
	port: 27017
};

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;    

exports.connect = function(dbName, next) {
	MongoClient.connect(
		format("mongodb://%s:%s/%s?w=1", config.host, config.port, dbName), function(err, db) {
		if(err) throw err;
		next(db, function() {
			console.log('closing databse .... ');
			db.close();
		});
	});
};