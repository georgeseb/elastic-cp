app.factory("transformationService", ["$http", function($http){

	var shardStoreToArray = function(input){

		var output = [];

		if (input === undefined || input.indices === undefined) {
			return output;
		}

		var temp = {};
		temp["~Unassigned"] = [];

		for (index in input.indices) {
			
			let selectedIndex = input.indices[index];

			for (shard in selectedIndex.shards) {

				let selectedShard = selectedIndex.shards[shard];

				if (selectedShard.stores.length == 0) {
					let newEntry = {
						index: index,
						shard: shard,
						allocation: "Unassigned",
						name: "Unassigned",
						node: "Unassigned"
					}
					temp["~Unassigned"].push(newEntry); 
				}

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
								if (temp[newEntry.name] === undefined) {
									temp[newEntry.name] = [];
								} 
								temp[newEntry.name].push(newEntry);
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


