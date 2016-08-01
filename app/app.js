var app = angular.module("elasticMapper", ['ngRoute']);

app.run(["elasticsearchService", function(elasticsearchService){
	elasticsearchService.createTempIndex();
}])

