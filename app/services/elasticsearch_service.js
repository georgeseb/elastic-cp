app.factory("elasticsearchService", ["$http", function($http){

	var elasticsearchHost = "http://localhost:9200";

	var createTempIndex = function(indexName) {

		if (indexName === undefined) {
			indexName = "elasticmapper-" + (new Date()).getTime();
		} 
		
		var endpoint = elasticsearchHost + "/" + indexName;

		var data = {
		    "settings" : {
		        "index" : {
		            "number_of_shards" : 1, 
		            "number_of_replicas" : 0
		        }
		    }
		}

		return $http.post(endpoint, data);
	}

	var sendAnalyzeRequest = function(data, index){

		var endpoint = elasticsearchHost + "/_analyze" + (index !== undefined ? "/" + index : "");

		if (data === undefined) {
			data = {};
		}

		return $http.post(endpoint, data);
	};

	var updateStats = function(){

		var endpoint = elasticsearchHost + "/_stats";

		return $http.get(endpoint);
	}

	var updateClusterState = function(){

		var endpoint = elasticsearchHost + "/_cluster/state";

		return $http.get(endpoint);
	}

	var getClusterHealth = function(){
		var endpoint = elasticsearchHost + "/_cluster/health";

		return $http.get(endpoint);
	}

	var getShardStore = function(){
		var endpoint = elasticsearchHost + "/_shard_stores?status=red,yellow,green";

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
		sendAnalyzeRequest: sendAnalyzeRequest,
		createTempIndex: createTempIndex,
		updateStats: updateStats,
		updateClusterState: updateClusterState,
		genericRequest: genericRequest,
		getShardStore: getShardStore,
		getClusterHealth: getClusterHealth
	};
}]);