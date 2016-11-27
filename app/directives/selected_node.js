app.directive("selectedNode", function(){

	var linkFunction = function(scope, element, attr){
		console.log(scope.data)
	}

	return {
		restrict: "E",
		scope: {
			data: "="
		},
		templateUrl: "app/directives/templates/selected_node_template.html",
		link: linkFunction
	};
});