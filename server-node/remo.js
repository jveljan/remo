var server = require('./restify-server');
var mongoWrap = require('./mongo-wrap');

server.start(3030, '/db', function(req, resp) {
	console.log('recieved request  collectionName: ', req.params.collectionName);
	
	var db = 'mydb';
	var collectionName = req.params.collectionName;
	
	console.log("  parsing request ... ", req.body);
	//var obj = JSON.parse(req.body);
	var obj = req.body;
	console.log("  got: ", typeof obj, obj);
	
	console.log("calling mongoWrap .... ");
		//req.body
		//eg. {method: 'find', args: []}
	mongoWrap.doOp(db, collectionName, obj, function(result) {
		resp.send(200, result);
	});
});