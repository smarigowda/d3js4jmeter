var myApp = angular.module('myApp', [])
.factory('Data', function() {
	return { elapsedTime: 0 };
})
// using inline injection annotation
// note that $injector can be injected!
.controller('MyController', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.resp_time = Data;
  window.scope = $scope;
}]);

