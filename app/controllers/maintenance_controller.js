app.controller("maintenanceController", ["$scope", "elasticsearchService", function($scope, elasticsearchService){

	$scope.parent = $scope.$parent;

	$scope.deleteIndex = function(indexName){
		elasticsearchService.genericRequest("DELETE", "/" + indexName)
							.then((resp) => {
								$scope.parent.getStats();
							})
	}
	
}]);