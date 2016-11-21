app.factory("transformationService", ["$http", function($http){

	var routingNodesTransform = function(input) {

		let result = [];

		if (input === undefined || input.nodes === undefined || input.routing_nodes === undefined) {
			return result;
		}

		let nodes = input.routing_nodes.nodes;

		for(key in nodes) {
			nodes[key]["name"] = input.nodes[key].name;
			result.push(nodes[key]);
		}

		input.routing_nodes.unassigned.name = "Unassigned"
		result.push(input.routing_nodes.unassigned)

		return result;
	}

	return {
		routingNodesTransform: routingNodesTransform
	};
}]);


