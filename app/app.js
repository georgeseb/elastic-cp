var app = angular.module("elasticMapper", ['ngRoute', 'ui.bootstrap']);

app.run(["$window", "elasticsearchService", function($window, elasticsearchService){
	
	var elasticMapperIndex = ".elasticmapper";

	elasticsearchService
		.checkForIndex(elasticMapperIndex)
		.then((r) => {}, (err) => {

			if (err.status == 404) {
				var configurations = {
				    "settings" : {"index" : {"number_of_shards" : 1, "number_of_replicas" : 0}}
				}
				elasticsearchService.createIndex(elasticMapperIndex, configurations);
			}
		});
}])

