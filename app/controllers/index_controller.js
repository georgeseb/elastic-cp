app.controller("indexController", ["$scope", "elasticsearchService", function($scope, elasticsearchService){

	$scope.parent = $scope.$parent;

	$scope.deleteIndex = function(indexName){
		elasticsearchService.deleteIndex(indexName).then((resp) => {
			$scope.parent.updateStats();
		})
	}

	$scope.openIndex = function(indexName){
		elasticsearchService.openIndex(indexName).then((resp) => {
			$scope.parent.updateStats(1000, 0);
		})
	}

	$scope.closeIndex = function(indexName){
		elasticsearchService.closeIndex(indexName).then((resp) => {
			$scope.parent.updateStats();
		})
	}

	$scope.clearCache = function(indexName, type){

		var params = {};
		params[type] = "";

		elasticsearchService.clearCache(indexName, params).then((resp) => {
			$scope.parent.updateStats();
		})
	}

	$scope.getDate = function(date){
		return new Date(parseInt(date)).toLocaleDateString();
	}
	
}]);