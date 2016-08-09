app.controller("clusterController", ["$scope", "elasticsearchService", "transformationService", function($scope, elasticsearchService, transformationService){

	elasticsearchService.getShardStore()
						.then(function(resp) {

									var trasformedData = transformationService.shardStoreToArray(resp.data)

									var svg = d3.select("#clusterGraphic")
										.append("svg")
											.attr("width", 1500)
											.attr("height", 500);
										

									var arc = d3.arc()
												.innerRadius(50)
												.outerRadius(100)
												.padAngle(.15)


									let i = 0;
									for (key in trasformedData) {

										let arcs = d3.pie()
												 .value(d => 1)
												 (trasformedData[key]);

										svg
											.append("g")
											.selectAll("path")
											.data(arcs)
											.enter()
												.append("path")
												.attr("d", d => {return arc(d)})
												.attr("transform", "translate(" + (100 + (i * 250)) + ", 100)")
												.attr("stroke", "#130401")
												.attr("stroke-width", 2)
												.attr("fill", "#D89D91")
										i++;
									}
						})
	
	
}]);