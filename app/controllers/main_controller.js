app.controller("mainController", ["$scope", "$location", "elasticsearchService", 
	function($scope, $location, elasticsearchService){

	$scope.stats;
	$scope.clusterState;
	
	$scope.updateStats = function(timeout){

		setTimeout(() => {
			elasticsearchService.getStats().then((resp) => {
				$scope.stats = resp.data;
			})
		}, timeout);
	}

	$scope.updateClusterState = function(timeout){

		return elasticsearchService.getClusterState().then((resp) => {
			$scope.clusterState = resp.data;
			return resp;
		})
	}

	$scope.updateStats();	
	$scope.updateClusterState();

	//http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
	var tabIndexToRoute = {
		0: "/start",
		1: "/analysis",
		2: "/cluster",
		3: "/index"
	};

	$scope.$watch(() => {return $scope.activeTab;}, (newVal, oldVal) => {
		$location.path(tabIndexToRoute[newVal]);
	})

}]);