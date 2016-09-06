app.provider("elasticsearchService", function elasticsearchServiceProvider(){

	var elasticsearchHost;

	this.setElasticsearchHost = function(host){
		elasticsearchHost = host;
	}

	this.$get = ["$http", function($http){

		var genericRequest = function(method, endpoint, body, params){

			if (method === undefined || endpoint === undefined) {
				return;
			}

			var config = {
				method: method,
				url: elasticsearchHost + endpoint,
				params: params
			};

			if (body !== undefined){
				config.data = body;
			}

			return $http(config);
		}

		var checkForIndex = function(indexName){
			return genericRequest("HEAD", "/" + indexName);
		}

		var createIndex = function(indexName, configurations) {
			return genericRequest("POST", "/" + indexName, configurations);
		}

		var sendAnalyzeRequest = function(data, index){
			var endpoint = "/_analyze" + (index !== undefined ? "/" + index : "");
			return genericRequest("POST", endpoint, data);
		};

		var updateStats = function(){
			return genericRequest("GET", "/_stats");
		}

		var updateClusterState = function(){
			return genericRequest("GET", "/_cluster/state");
		}

		var getClusterHealth = function(){
			return genericRequest("GET", "/_cluster/health");
		}

		var getShardStore = function(){
			var params = {status: "red,yellow,green"};
			return genericRequest("GET", "/_shard_stores", undefined, params);
		}

		return {
			genericRequest: genericRequest,
			checkForIndex: checkForIndex,
			createIndex: createIndex,
			sendAnalyzeRequest: sendAnalyzeRequest,
			updateStats: updateStats,
			updateClusterState: updateClusterState,
			getShardStore: getShardStore,
			getClusterHealth: getClusterHealth
		};
	}];

	
});