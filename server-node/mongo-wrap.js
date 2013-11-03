
var mongoClient = require('./mongo-client');
var util = require('util');
var ObjectID = require('mongodb').ObjectID

/**
 * example: doOp('myDb', 'Users', {method: 'find'}, function(result) {}); 
 */
exports.doOp = function(dbName, collectionName, op, rc) {

// collectionName; //"Users";
var method = op.method; //'find';
var args = op.args; //undefined;

var arr_copy = function(arr) {
	var rv = [];
	for(var i=0; i<arr.length; i++) {
		rv.push(arr[i]);
	}
	return rv;
}

var opsDefs = [{
	op: 'find',
	async: false,
	chainOp: 'toArray'
}];

var getMethodDef = function(m) {
	var d = opsDefs.filter(function(_) { return _.op == m})[0];
	return d || {op: '$defaults', async: true};
};
var map_ids = function(o) {
	if(util.isArray(o)) return o.map(map_ids(o));
	if(o._id) o._id = ObjectID(o._id);
	return o;
} 

var connectHandler = function(db, next) {
	var collection = db.collection(collectionName);
	var args_arr = arr_copy(args || []).map(map_ids);
	//"_id" : ObjectId("50691737d386d8fadbd6b01d")
	console.log('Calling method ' + method + ' on collection ' + collectionName + " with arguments: ", args_arr);
	var resultsCallback = function(err, results) {
		if(err) throw err;
		//console.log('Executed ' + method + ' on collection ' + collectionName, results);
		rc(results);
		next(results);
	};
	
	var methodDef = getMethodDef(method);
	if(methodDef.async) {
		args_arr.push(resultsCallback); //add next fn
		collection[method].apply(collection, args_arr);
	} else {
		var r = collection[method].apply(collection, args_arr);
		r[methodDef.chainOp].call(r, resultsCallback);
	}
	
};

mongoClient.connect(dbName, connectHandler);
};

