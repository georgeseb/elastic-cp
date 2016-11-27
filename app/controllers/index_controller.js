app.controller("indexController", ["$scope", "$interval", "elasticsearchService", "transformationService",
	function($scope, $interval, elasticsearchService, transformationService){

	$scope.parent = $scope.$parent;

	//Refactor Later -- start
	$scope.routingNodes = undefined;
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
	}

	//Refactor Later -- end

	$scope.deleteIndex = function(indexName){
		elasticsearchService.deleteIndex(indexName).then((resp) => {
			$scope.parent.updateStats();
			$scope.parent.updateClusterState();
		})
	}

	$scope.openIndex = function(indexName){
		elasticsearchService.openIndex(indexName).then((resp) => {
			$scope.parent.updateStats(1000);
			$scope.parent.updateClusterState();
		})
	}

	$scope.closeIndex = function(indexName){
		elasticsearchService.closeIndex(indexName).then((resp) => {
			$scope.parent.updateStats();
			$scope.parent.updateClusterState();
		})
	}

	$scope.clearCache = function(indexName, type){

		var params = {};
		params[type] = "";

		elasticsearchService.clearCache(indexName, params).then((resp) => {
			$scope.parent.updateStats();
			$scope.parent.updateClusterState();
		})
	}

	$scope.getDate = function(date){
		return new Date(parseInt(date)).toLocaleDateString();
	}
	
}]);