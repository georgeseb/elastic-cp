app.controller("mainController", ["$scope", "$location", "$http", "elasticsearchService", 
	function($scope, $location, $http, elasticsearchService){

	$scope.stats;
	$scope.clusterState;
	$scope.host;
	$scope.hostValid;
	
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