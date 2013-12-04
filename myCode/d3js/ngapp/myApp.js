var myApp = angular.module('myApp', [])
.factory('Data', function() {
	return { elapsedTime: 0 };
})
// using inline injection annotation
// note that $injector can be injected!
.controller('MyController', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.resp_time = Data;
  window.scope = $scope;
}])
.controller('MyReportController', ['$scope', function($scope){
	$scope.tgreport = {};
	$scope.genReport = function(folder_name, file_name) {

			d3.csv("./data/".concat(folder_name, "/", file_name), function(data) {
				data.map(function(d) { d.strStartTime = new Date(+d.start_time) } );
				data.map(function(d) { d.strEndTime = new Date(+d.end_time); } );
				// unit = min
				data.map(function(d) { d.duration = Math.round((d.strEndTime - d.strStartTime) / 1000 / 60) } );
				$scope.tgreport = data;
				// communicate to ng
				$scope.$apply($scope.tgreport);
				console.log($scope.tgreport.data);
			});
	}
	// to debug
	window.controller_scope = $scope;
}])
.directive('durationReport', function () {
	return {
		restrict: 'A',
		scope: {},
		controller: 'MyReportController',
		link: function (scope, elem, attrs) {
			console.log("Recognized the fundoo-rating directive usage");

			// scope of director is same as the scope of the controller MyReportController
			// check via console, they both will have the same $id
			window.director_scope = scope;
			console.log(elem);
			console.log(attrs);
			console.log(attrs.folderName);
			console.log(attrs.fileName);

			scope.genReport(attrs.folderName, attrs.fileName);
			// var file_name = 'tg_startend_report.txt';
			// var folder_name = 'iml_Nov2013/29112013_145001_BASELINE_50TCHR_500STU';
			
		},
		templateUrl: 'template.html'
	}
});