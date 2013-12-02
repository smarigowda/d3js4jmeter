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
	window.scope = $scope;
}])
.directive('fundooRating', function () {
	return {
		restrict: 'A',
		scope: {},
		link: function (scope, elem, attrs) {
			console.log("Recognized the fundoo-rating directive usage");
			console.log(elem);
			console.log(attrs);

			console.log(attrs.folderName);
			console.log(attrs.fileName);


			// var file_name = 'tg_startend_report.txt';
			// var folder_name = 'iml_Nov2013/29112013_145001_BASELINE_50TCHR_500STU';
			scope.tgreport=undefined;

			d3.csv("./data/".concat(attrs.folderName, "/", attrs.fileName), function(data) {

				data.map(function(d) { d.strStartTime = new Date(+d.start_time) } );
				data.map(function(d) { d.strEndTime = new Date(+d.end_time); } );
				data.map(function(d) { d.duration = Math.round((d.strEndTime - d.strStartTime) / 1000 / 60) } );
				scope.tgreport = data;
				scope.$apply(scope.tgreport);
				console.log(data);

			});
		},
		controller: 'MyReportController',
		templateUrl: 'template.html'
	}
});