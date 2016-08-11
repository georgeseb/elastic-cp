app.controller("clusterController", ["$scope", "elasticsearchService", "transformationService", "$interval",
	function($scope, elasticsearchService, transformationService, $interval){

	var refreshRate = 1000;
	var refreshIntervalHandle = $interval(() => elasticsearchService
											.getShardStore()
											.then(clusterStatusDisplay), 
								refreshRate);

	$scope.$on("$destroy", () => {
		console.log("Cluster controller destroyed.")
		$interval.cancel(refreshIntervalHandle);
	})

	function clusterStatusDisplay(resp) {

		var trasformedData = transformationService.shardStoreToArray(resp.data)

		d3.select("#clusterGraphic").select("svg").remove();

		var svg = d3.select("#clusterGraphic")
			.append("svg")
				.attr("width", 1500)
				.attr("height", 500);
			

		var arc = d3.arc()
					.innerRadius(50)
					.outerRadius(100)
					.padAngle(.15)


		let i = 0;
		let downTranslate = 100;

		for (key in trasformedData) {

			let arcs = d3.pie()
					 .value(d => 1)
					 (trasformedData[key]);

			for (let i = 0; i < arcs.length; i++) {
				arcs[i].data = trasformedData[key][i];
			}

			svg
				.append("g")
				.selectAll("path")
				.data(arcs)
				.enter()
					.append("path")
					.attr("d", d => {return arc(d)})
					.attr("transform", "translate(" + (100 + (i * 250)) + ", " + downTranslate + ")")
					.attr("stroke", "black")
					.attr("stroke-width", .5)
					.attr("fill", d => {
						if (d.data.allocation == "primary") {
							return "#8ECFE4";
						}
						return "#8EE498";
					})

			i++;
			
			if (i == 3) {
				downTranslate += 250;
				i = 0;
			}
			
		}
	}

	
	
	
}]);