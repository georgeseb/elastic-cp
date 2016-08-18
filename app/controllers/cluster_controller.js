app.controller("clusterController", ["$scope", "elasticsearchService", "transformationService", "$interval", "$window",
	function($scope, elasticsearchService, transformationService, $interval, $window){

	$scope.clusterStatusMapping = {
		red: "label-danger",
		yellow: "label-warning",
		green: "label-success"
	};

	$scope.selectedShard = {};

	var refreshRate = 3000;

	var refreshIntervalHandle = $interval(intervalFunction, refreshRate);
	intervalFunction();

	$scope.$on("$destroy", () => {
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

	$scope.colorScale = d3.scaleOrdinal(d3.schemeCategory20);

	function clusterStatusDisplay(resp) {

		let transformedData = transformationService.shardStoreToArray(resp.data);

		//Sort by node and for each node sort the corresponding array by index name.
		var nodes = [];
		for (key in transformedData) {
			nodes.push(key);
			transformedData[key] = _.sortBy(transformedData[key], (d) => d.index);
		}
		nodes.sort();

		let horizontalWidth = $window.innerWidth * (3/10);
		let horizontalCount = 2;

		let svgWidth = horizontalWidth;

		let spacePerNode = (horizontalWidth / horizontalCount);

		let svgHeight = spacePerNode;

		//Use 3/4 of the space for the drawing.
		let outerRadius = (1/2) * ((4/5) * spacePerNode);

		let innerRadius = outerRadius / 2;
		let padAngle = outerRadius / 10000;
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

		for (let n = 0; n < nodes.length; n++) {

			if (xPosition == horizontalCount) {
				xPosition = 0;
				svgHeight += spacePerNode;
				svg.attr("height", svgHeight)
			}

			
			let arcs = d3.pie().value(d => 1)(transformedData[nodes[n]]);

			for (let i = 0; i < arcs.length; i++) {
				arcs[i].data = transformedData[nodes[n]][i];
			}

			let group = svg.append("g");

			group
				.selectAll("path")
				.data(arcs)
				.enter()
					.append("path")
					.attr("d", d => {return arc(d)})
					.attr("transform", "translate(" + (outerRadius + (xPosition * spacePerNode)) + ", " 
						+ (svgHeight - spacePerNode/2) + ")")
					.attr("fill", (d) => {
						let index = d.data.index;
						return $scope.colorScale(index);
					})
					.attr("stroke-width", d => {
						if (d.data.allocation == "primary") {
							return 2;
						}
						return 0;
					})
					.attr("stroke", d => {
						if (d.data.allocation == "primary") {
							return "black";
						}
						return "white";
					})
					.style("cursor", "pointer")	
					.on("click", (d, i, nodes) => {
						$scope.selectedShard = d.data;
						$scope.$digest();
					})

			group
			.append("text")
			.attr("transform", "translate(" + (xPosition * spacePerNode)
				  + ", " + svgHeight + ")")
			.text(nodes[n]);

		/*
			group
				.selectAll("path")
				.append("text")
				.attr("transform", "translate(" + (outerRadius + (xPosition * spacePerNode)) + ", " + (outerRadius + (svgHeight - spacePerNode)) + ")")
				.text("Hello")
		*/

			xPosition++;
		}
	}

	
	
	
}]);