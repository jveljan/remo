!function($) {

var RemoEntity = function(db, name) {
	var methods = ['find', 'findOne', 'insert', 'save', 'remove'];
	var createMethod = function(m) {
		return function() {
			if(arguments.length<1) throw 'Callback must be provided';
			var args = [];
			var callback = arguments[arguments.length-1];
			for(var i=0; i<arguments.length-1; i++) {
				args.push(arguments[i]);
			}
			db.callMethod(name, m, args, callback); 
		}
	}
	
	for(var i=0; i<methods.length; i++) {
		var m = methods[i];
		this[m] = createMethod(m);
	}
}

var RemoDB = function(url, $http) {
	this.collection = function(collectionName) {
		return new RemoEntity(this, collectionName);
	};
	this.callMethod = function(entity, method, args, callback) {
		var data = angular.toJson({method: method, args: args});
		var eurl = url + '/' + entity;
		$http.post(eurl, data)
			.success(callback)
			.error(function() {
				console.error('Error calling ', entity, method, args, "RESULT:", arguments);
			});
		//this.$http.post(eurl + '/' + entity, data, callback);
	};
	return this;
};

var RemoDBFactory = function($http) {
	this.create = function(url) {
		return new RemoDB(url, $http);
	};
	return this;
};
RemoDBFactory.$inject = ['$http'];
angular.module('cx').service('RemoDBFactory', RemoDBFactory);

}(jQuery);