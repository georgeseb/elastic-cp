var app = angular.module("elasticMapper", ['ngRoute', 'ui.bootstrap']);

app.run(["elasticsearchService", function(elasticsearchService){
	elasticsearchService.createTempIndex();
}])

