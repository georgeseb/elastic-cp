app.factory("transformationService", ["$http", function($http){

	var shardStoreToArray = function(input){

		var output = [];

		if (input === undefined || input.indices === undefined) {
			return output;
		}

		var temp = {};

		for (index in input.indices) {
			
			let selectedIndex = input.indices[index];

				for (shard in selectedIndex.shards) {

					let selectedShard = selectedIndex.shards[shard];

						for (store in selectedShard.stores) {

							let selectedStore = selectedShard.stores[store];

							let newEntry = {
										index: index,
										shard: shard,
										allocation: selectedStore.allocation
									};

							for (key in selectedStore) {

									if (selectedStore[key].name !== undefined) {
										newEntry.name = selectedStore[key].name;
										newEntry.node = key;
										if (temp[key] === undefined) {
											temp[key] = [];
										} 
										temp[key].push(newEntry);
										break;
									}
									
							}
						}
				}	
		}

		return temp;
	}
		

	return {
		shardStoreToArray: shardStoreToArray
	};
}]);


