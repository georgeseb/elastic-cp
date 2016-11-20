app.controller("mainController", ["$scope", "$location", "$window", "elasticsearchService", 
	function($scope, $location, $window, elasticsearchService){

	$scope.stats;
	$scope.clusterState;
	$scope.parent = $scope.$parent;

	$scope.updateStats = function(timeoutStats, timeoutClusterState){

		setTimeout(() => {
			elasticsearchService.getStats().then((resp) => {$scope.stats = resp.data;})
		}, timeoutStats);

		setTimeout(() => {
			elasticsearchService.getClusterState().then((resp) => {$scope.clusterState = resp.data;})
		}, timeoutClusterState);
		
	}

	$scope.updateStats();	

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