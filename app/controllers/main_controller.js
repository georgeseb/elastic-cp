app.controller("mainController", ["$scope", "$location", "$window", "elasticsearchService", function($scope, $location, $window, elasticsearchService){

	$scope.stats;
	$scope.clusterState;

	$scope.updateStats = function(timeoutStats, timeoutClusterState){

		setTimeout(() => {
			elasticsearchService.updateStats().then((resp) => {$scope.stats = resp.data; console.log($scope.stats);})
		}, timeoutStats);

		setTimeout(() => {
			elasticsearchService.updateClusterState().then((resp) => {$scope.clusterState = resp.data;})
		}, timeoutClusterState);
		
	}

	$scope.updateStats();	

	//http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
	$scope.redirect = function(endpoint){
		$location.path(endpoint);
	}	


}]);