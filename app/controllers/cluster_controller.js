app.controller("clusterController", ["$scope", "elasticsearchService", "transformationService", "$interval", "$window",
	function($scope, elasticsearchService, transformationService, $interval, $window){

	$scope.routingNodes = undefined;
	$scope.selectedShard = {};

	$scope.clusterStatusMapping = {
		red: "label-danger",
		yellow: "label-warning",
		green: "label-success"
	};

	var refreshRate = 1000;
	var refreshIntervalHandle = undefined;
	
	intervalFunction();

	$scope.$watch(() => {return $scope.$parent.refresh;}, (newValue, oldValue) => {
		if (newValue == true) {
			if (refreshIntervalHandle === undefined) {
				refreshIntervalHandle = $interval(intervalFunction, refreshRate);
			}
		} else {
			if (refreshIntervalHandle !== undefined) {
				$interval.cancel(refreshIntervalHandle);
				refreshIntervalHandle = undefined;
			}
		}
	})

	$scope.$on("$destroy", () => {
		$interval.cancel(refreshIntervalHandle);
		$scope.$parent.refresh = false;
	})

	function intervalFunction(){

		$scope.$parent.updateClusterState().then((r) => {
			$scope.routingNodes = transformationService.routingNodesTransform(r.data);
		});

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
	
}]);