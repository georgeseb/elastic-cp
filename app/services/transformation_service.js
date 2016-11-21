app.factory("transformationService", ["$http", function($http){

	var routingNodesTransform = function(input) {

		let result = new Map();

		if (input === undefined || input.nodes === undefined || input.routing_nodes === undefined) {
			return result;
		}

		//Maps a node name to an array of data.
		let nodes = input.routing_nodes.nodes;

		let nodeNames = [];

		for (nodeName in nodes) {
			//Each array associated with a node should be sorted based on index name.
			//nodes[nodeName] = _.sortBy(nodes[nodeName], (d) => d.index);
			nodeNames.push(nodeName);
		}

		//Sort the names of the nodes.
		//nodeNames.sort();

		//Populate the map in sorted order. The map will respect insertion order.
		for (let i = 0; i < nodeNames.length; i++) {
			let nodeName = nodeNames[i];
			nodes[nodeName]["name"] = input.nodes[nodeName].name;
			result.set(nodeName, nodes[nodeName]);
		}

		input.routing_nodes.unassigned.name = "Unassigned"
		result.set("Unassigned", input.routing_nodes.unassigned)

		return result;
	}

	return {
		routingNodesTransform: routingNodesTransform
	};
}]);


