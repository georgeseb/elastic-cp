app.provider("elasticsearchService", function elasticsearchServiceProvider(){

	var elasticsearchHost;

	this.setElasticsearchHost = function(host){
		elasticsearchHost = host;
	}

	this.$get = ["$http", function($http){

		var genericRequest = function(method, endpoint, body, params){

			if (method === undefined || endpoint === undefined) {
				return undefined;
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

		var deleteIndex = function(indexName){
			return genericRequest("DELETE", "/" + indexName);
		}

		var openIndex = function(indexName){
			return genericRequest("POST", "/" + indexName + "/_open")
		}

		var closeIndex = function(indexName){
			return genericRequest("POST", "/" + indexName + "/_close")
		}

		var clearCache = function(indexName, params){
			return genericRequest("POST", "/" + indexName + "/_cache/clear", params)
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

		var getStats = function(){
			return genericRequest("GET", "/_stats");
		}

		var getClusterState = function(){
			return genericRequest("GET", "/_cluster/state");
		}

		var getClusterHealth = function(){
			return genericRequest("GET", "/_cluster/health");
		}

		var setElasticsearchHost = function(host){
			elasticsearchHost = host;
		}

		return {
			elasticsearchHost: elasticsearchHost,
			setElasticsearchHost: setElasticsearchHost,
			genericRequest: genericRequest,
			deleteIndex: deleteIndex,
			openIndex: openIndex,
			closeIndex: closeIndex,
			clearCache: clearCache,
			checkForIndex: checkForIndex,
			createIndex: createIndex,
			sendAnalyzeRequest: sendAnalyzeRequest,
			getStats: getStats,
			getClusterState: getClusterState,
			getClusterHealth: getClusterHealth
		};
	}];
	
});