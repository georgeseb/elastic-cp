app.controller("mainController", ["$scope", "$location", "elasticsearchService", function($scope, $location, elasticsearchService){

	$scope.stats;

	$scope.getStats = function(){
		elasticsearchService.getStats().then((resp) => {$scope.stats = resp.data;})
	}

	$scope.getStats();

	//http://stackoverflow.com/questions/14201753/angular-js-how-when-to-use-ng-click-to-call-a-route
	$scope.redirect = function(endpoint){
		$location.path(endpoint);
	}	

}]);