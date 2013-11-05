!function() {


angular.module('test1', []);

var MainCtrl = function ($scope) {
var icons = ['cloud', 'compass', 'credit-card', 'dashboard', 'film', 'gear', 'laptop']
	$scope.list = icons.map(function(_) { return {title: _, icon: _}; });;
	$scope.toggle = function(a) {
		a.selected = !a.selected;
	}
};

MainCtrl.$inject = ['$scope'];
angular.module('test1').controller('MainCtrl', MainCtrl);

}();