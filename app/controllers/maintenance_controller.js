app.controller("maintenanceController", ["$scope", "elasticsearchService", function($scope, elasticsearchService){

	$scope.parent = $scope.$parent;
	$scope.selectedSideView;

	$scope.selectSideView = function(view){
		$scope.selectedSideView = view;
	}

	$scope.deleteIndex = function(indexName){
		elasticsearchService.genericRequest("DELETE", "/" + indexName)
							.then((resp) => {
								$scope.parent.updateStats();
							})
	}

	$scope.openIndex = function(indexName){
		elasticsearchService.genericRequest("POST", "/" + indexName + "/_open")
							.then((resp) => {
								$scope.parent.updateStats(1000, 0);
							})
	}

	$scope.closeIndex = function(indexName){
		elasticsearchService.genericRequest("POST", "/" + indexName + "/_close")
							.then((resp) => {
								$scope.parent.updateStats();
							})
	}

	$scope.getDate = function(date){
		return new Date(parseInt(date)).toLocaleDateString();
	}
	
}]);