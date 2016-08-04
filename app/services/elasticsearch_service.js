app.factory("elasticsearchService", ["$http", function($http){

	var elasticsearchHost = "http://localhost:9200";

	var createTempIndex = function() {

		var indexName = "elasticmapper-" + (new Date()).getTime();
		var endpoint = elasticsearchHost + "/" + indexName;

		var data = {
		    "settings" : {
		        "index" : {
		            "number_of_shards" : 1, 
		            "number_of_replicas" : 0
		        }
		    }
		}

		$http.post(endpoint, data);
		return indexName;
	}

	var sendAnalyzeRequest = function(data, index){

		var endpoint = elasticsearchHost + "/_analyze" + (index !== undefined ? "/" + index : "");

		if (data === undefined) {
			data = {};
		}

		return $http.post(endpoint, data);
	};

	var getStats = function(){

		var endpoint = elasticsearchHost + "/_stats";

		return $http.get(endpoint);
	}

	var genericRequest = function(method, endpoint, body){

		if (method === undefined || endpoint === undefined) {
			return;
		}

		var config = {
			method: method,
			url: elasticsearchHost + endpoint
		};

		if (body !== undefined){
			config.data = body;
		}

		return $http(config);
	}


	return {
		host: elasticsearchHost,
		sendAnalyzeRequest: sendAnalyzeRequest,
		createTempIndex: createTempIndex,
		getStats: getStats,
		genericRequest: genericRequest
	};
}]);