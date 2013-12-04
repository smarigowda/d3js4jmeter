var myApp = angular.module('myApp', [])
.factory('Data', function() {
	return { elapsedTime: 0 };
})

// note that $injector can be injected!
.controller('MyController', ['$scope', 'Data', '$injector', function($scope, Data, $injector){
  $scope.resp_time = Data;
  window.scope = $scope;
}])
.controller('MyReportController', ['$scope', function($scope){
	$scope.tgreport = {};
	$scope.genReport = function(folder_name, file_name) {

			d3.csv("./data/".concat(folder_name, "/", file_name), function(data) {
				data.map(function(d) { d.strStartTime = new Date(+d.start_time); } );
				data.map(function(d) { d.strEndTime = new Date(+d.end_time); } );
				// unit = min
				data.map(function(d) { d.duration = Math.round((d.strEndTime - d.strStartTime) / 1000 / 60); } );
				$scope.tgreport = data;
				// communicate to ng
				$scope.$apply($scope.tgreport);
				console.log($scope.tgreport.data);
			});
	};
	// to debug
	window.controller_scope = $scope;
}])
.controller('MyTSPlotController', ['$scope', function($scope){
	console.log('hello from MyTSPlotController');
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
	};
})
.directive('jmTsplot', function() {
	return {
		restrict: 'A',
		scope: {},
		link: function (scope, elem, attrs) {
			console.log('hello from directive jmTsPlot');
			console.log('@ directive folder name = '.concat(attrs.folderName));
			console.log('@ directive file name = '.concat(attrs.fileName));
			
			d3.csv("./data/".concat(attrs.folderName, "/", attrs.fileName), function(data) {
				// console.log('data @ controller'.concat(data));

				// create a selection html element
				// use unique data labels
				var labels = _.uniq(data.map(function(d) { return d.label; } ));
				console.log(labels);

				var select = d3.select('body').append('select');
				select.append('option').attr('value', 'ALL').text('ALL');
				select.selectAll('option')
						.data(labels).enter().append('option')
						.attr('value', function(d) { return d; })
						.text(function(d) { return d; });

				console.log('@ directive: select is....');
				console.log(select);

				var data_bkp = data;
				var filt_data;

					// filter the data and redraw the plot
						select.on('change', function() {

							var selected_label = this.value;

							console.log('selected value:'.concat(this.value));

							if (selected_label !== 'ALL') {
								filt_data = _.filter(data, function(d) { return d.label === selected_label; });
							}

							console.log('Filtered data...');
							console.log(filt_data);
							// remove the plot
							d3.selectAll('svg').remove();
							console.log('data bkp......');
							console.log(data_bkp);
							// re-draw the plot
							if ( selected_label === 'ALL' ) { scope.drawPlot(data_bkp); } else { scope.drawPlot(filt_data); }
						});
				console.log('csv data read:');
				scope.drawPlot(data_bkp);

			});

			scope.drawPlot = function(data) {

					var margin = {top: 20, right: 20, bottom: 400, left: 100},
						width = 2000 - margin.left - margin.right,
						height = 800 - margin.top - margin.bottom;

					var x = d3.time.scale().range([0, width]);
					var y = d3.scale.linear().range([height, 0]);
					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom")
						.ticks(30)
						.tickFormat(d3.time.format("%H-%M-%S"));

					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

					// convert time stamp to number
					data.map(function(d) { d.timeStamp = +d.timeStamp; });
					data.map(function(d) { d.elapsed = +d.elapsed; });

					console.log(data);
					x.domain(d3.extent(data.map(function(d) {return d.timeStamp;})));

					console.log("x.domain()");
					console.log(x.domain());
					console.log("x.range()");
					console.log(x.range());
					// console.log(x(new Date(0)));
					// set y domain
					y.domain(d3.extent(data.map(function(d){return d.elapsed;})));
					console.log(y.domain());
					var svg = d3.select("body").append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom)
									.append("g")
									.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					// draw x axis          
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);
					// draw y axis
					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis);
					svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
						.style("text-anchor", "end")
						.attr("transform", function(d) {
							console.log("getBBox");
							console.log(this.getBBox());
							return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(-90)"; });
							//console.log(this.getBBox());
							//return "translate(" + this.getBBox().height*-1.0 + "," + this.getBBox().height + ")rotate(0)"; */
					// scatter plot
					svg.selectAll("scatter-dots")
						.data(data)
						.enter().append("svg:circle")
						.attr("cy", function (d) { return y(d.elapsed); } )
						.attr("cx", function (d) { return x(d.timeStamp); } )
						.attr("r", 5)
						.attr('fill', function(d) { if (d.elapsed > 5000) { return 'red'; } else { return 'green'; } })
						.style("opacity", 0.3)
						.append("title").text(function(d){ return ''.concat(d.elapsed, ':' , d.label); });
			};

		},
		templateUrl: 'jmtsplot_template.html'
	};
});