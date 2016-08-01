app.controller("analysisController", ["$scope", "elasticsearchService", function($scope, elasticsearchService){

	$scope.rawText = "Performs the analysis process on a text";
	$scope.selectedAnalyzer = "standard";
	$scope.availableAnalyzers = ["standard","simple","whitespace","stop","keyword","pattern","language","snowball","custom"];
	$scope.tokens = [];

	$scope.sendAnalyzeRequest = function(){

		if ($scope.selectedAnalyzer != "custom") {
			var requestData = {
				analyzer: $scope.selectedAnalyzer,
				text: $scope.rawText
			};

			elasticsearchService.sendAnalyzeRequest(requestData)
								.then(function(resp){
									$scope.tokens = resp.data.tokens;
									console.log($scope.token);
								});
		}
	}
	
}]);