!function() {


angular.module('app', ['cx']);

//get rdb database for this application 
angular.module('app').service('rdb', ['RemoDBFactory', function(RemoDBFactory) {
	return RemoDBFactory.create('http://localhost:3030/db');
}]);

var removed = function(ls, obj) {
	return ls.filter(function(_) { return _ != obj; });
};


var TodoCtrl = function ($scope, rdb) {
	var Todos = rdb.collection('Todo');
	
	$scope.refresh = function() {
		//maybe loading indicator ... 
		Todos.find(function(result) {
			$scope.todos = result;
		});
	};
	
	$scope.todos = [];
	$scope.refresh();
	
	$scope.remaining = function() {
		return $scope.todos.filter(function(_) { return !_.done }).length;
	}
	
	$scope.add = function() {
		var todo = {text: $scope.txt, done: false, created: new Date};
		Todos.insert(todo, function(result) {
			$scope.todos.push(result[0]);
			//fetchTodos();
			$scope.txt = "";
		});
	};
	
	$scope.todoCheck = function(todo) {
		//update todo; save done flag to db
		Todos.save(todo, function() {});
	}
	
	$scope.remove = function(todo) {
		Todos.remove(todo, function() {
			$scope.todos = removed($scope.todos, todo); 
		});
	};
	
	$scope.removeCompleted = function() {
		Todos.remove({done: true}, function(r) {
			console.log("Removed " + r + " items.");
			if(r > 0) { //number of items removed
				$scope.refresh();
			}
		});
	};
	
	$scope.todoTextClick = function(todo) {
		todo.done = !todo.done;
		$scope.todoCheck(todo);
	}
};

TodoCtrl.$inject = ['$scope', 'rdb'];
angular.module('app').controller('TodoCtrl', TodoCtrl);

}();