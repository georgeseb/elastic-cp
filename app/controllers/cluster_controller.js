app.controller("clusterController", ["$scope", "elasticsearchService", "transformationService", "$interval",
	function($scope, elasticsearchService, transformationService, $interval){

	$scope.clusterStatusMapping = {
		red: "label-danger",
		yellow: "label-warning",
		green: "label-success"
	};

	var refreshRate = 1000;

	var refreshIntervalHandle = $interval(intervalFunction, refreshRate);
	intervalFunction();

	$scope.$on("$destroy", () => {
		console.log("Cluster controller destroyed.")
		$interval.cancel(refreshIntervalHandle);
	})

	function intervalFunction(){
		elasticsearchService.getShardStore().then(clusterStatusDisplay);
		elasticsearchService.getClusterHealth().then(clusterHealthProcess);
	}

	function clusterHealthProcess(resp) {
		var data = resp.data;
		$scope.clusterName = data.cluster_name;
		$scope.clusterStatus = data.status;
		$scope.numberOfNodes = data.number_of_nodes;
		$scope.numberOfDataNodes = data.number_of_data_nodes;
		$scope.activeShards = data.active_shards;
		$scope.relocatingShards = data.relocating_shards;
		$scope.initializingShards = data.initializing_shards;
		$scope.unassignedShards = data.unassigned_shards;
		$scope.delayedUnassignedShards = data.delayed_unassigned_shards;
	}

	function translateValue(){

	}

	function clusterStatusDisplay(resp) {

		let trasformedData = transformationService.shardStoreToArray(resp.data);

		let horizontalWidth = 500;
		let horizontalCount = 3;

		let svgWidth = horizontalWidth;

		let spacePerNode = (horizontalWidth / horizontalCount);

		let svgHeight = spacePerNode;

		//Use 3/4 of the space for the drawing.
		let outerRadius = (1/2) * ((4/5) * spacePerNode);

		let innerRadius = outerRadius / 2;
		let padAngle = outerRadius / 1000;
		let cornerRadius = outerRadius / 10;

		d3.select("#clusterGraphic").select("svg").remove();

		let svg = d3.select("#clusterGraphic")
			.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight);

		let arc = d3.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius)
					.padAngle(padAngle)
					.cornerRadius(cornerRadius)


		let xPosition = 0;

		for (key in trasformedData) {

			if (xPosition == horizontalCount) {
				xPosition = 0;
				svgHeight += spacePerNode;
				svg.attr("height", svgHeight)
			}

			let arcs = d3.pie().value(d => 1)(trasformedData[key]);

			for (let i = 0; i < arcs.length; i++) {
				arcs[i].data = trasformedData[key][i];
			}

			let group = svg.append("g")

			group
				.selectAll("path")
				.data(arcs)
				.enter()
					.append("path")
					.attr("d", d => {return arc(d)})
					.attr("transform", "translate(" + (outerRadius + (xPosition * spacePerNode)) + ", " + (outerRadius + (svgHeight - spacePerNode)) + ")")
					.attr("stroke", "black")
					.attr("stroke-width", .5)
					.attr("fill", d => {
						if (d.data.allocation == "primary") {
							return "#8EE498";
						}
						return "#8ECFE4";
					});

		/*
			group
				.append("text")
				.attr("transform", "translate(" + (outerRadius + (xPosition * spacePerNode)) + ", " + (outerRadius + (svgHeight - spacePerNode)) + ")")
				.text("Hello")
		*/

			xPosition++;
		}
	}

	
	
	
}]);