var restify = require('restify');

var server = restify.createServer();

server
	.use(restify.fullResponse())
	.use(restify.bodyParser());
	
server.on('MethodNotAllowed', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
	res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
	console.log(req.method);
	//if(req.method == 'OPTIONS' ) return res.send(204);
	//return next();
	
	return res.send(204);
});

exports.start = function(port, ctx, respond) {
	server.get(ctx+'/:collectionName', respond);
	server.post(ctx+'/:collectionName', respond);

	server.listen(port, function() {
	  console.log('%s listening at %s', server.name, server.url);
	});
}
