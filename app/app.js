var app = angular.module("elasticMapper", ['ngRoute', 'ui.bootstrap']);

app.run(["$window", "elasticsearchService", function($window, elasticsearchService){
	
	var elasticMapperIndex = ".elasticmapper";

	elasticsearchService
		.genericRequest("HEAD", "/" + elasticMapperIndex)
		.then((resp) => {}, (err) => {
			if (err.status == 404) {
				elasticsearchService
					.createTempIndex(elasticMapperIndex)
			}
		});

}])

