app.controller("startController", ["$scope", "$http", "elasticsearchService", function($scope, $http, elasticsearchService){
	
	$scope.host;
	$scope.hostValid;

	$scope.checkAndSetHost = function(){
		var fullHost = "http://" + $scope.host;
		if ($scope.host != elasticsearchService.elasticsearchHost) {
			$http.get(fullHost).then((resp) => {
				if (resp.status == 200) {
					$scope.hostValid = true;
					elasticsearchService.setElasticsearchHost(fullHost);
				}
			})
		}
	}
	
}]);