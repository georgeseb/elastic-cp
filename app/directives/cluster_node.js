app.directive("clusterNode", ["$window", function($window){

	var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

	var linkFunction = function(scope, element, attr){

		scope.$watch(() => {return scope.data}, (routingData, oldRoutingData) => {


			if (routingData === undefined) {
				return;
			}

			let svgSquareDim = $window.innerWidth * (1/5);

			let outerRadius = ((4/5) * svgSquareDim) / 2;
			let innerRadius = outerRadius / 1.5;

			let padAngle = outerRadius / 10000;
			let cornerRadius = outerRadius / 10;

			d3.select(element[0]).select("svg").remove();

			let svg = d3.select(element[0])
				.append("svg")
					.attr("width", svgSquareDim)
					.attr("height", svgSquareDim)
					.attr("background-color", "blue")

			let arc = d3.arc()
						.innerRadius(innerRadius)
						.outerRadius(outerRadius)
						.padAngle(padAngle)
						.cornerRadius(cornerRadius)

			let arcs = d3.pie().value(d => 1)(routingData);

			for (let i = 0; i < arcs.length; i++) {
				arcs[i].data = routingData[i];
				arcs[i].data.name = routingData.name;
				arcs[i].data.color = colorScale(routingData[i].index);
			}

			let group = svg.append("g");

			group
				.selectAll("path")
				.data(arcs)
				.enter()
					.append("path")
					.attr("d", d => {return arc(d)})
					.attr("transform", "translate(" + svgSquareDim/2 + ", " + svgSquareDim/2 + ")")
					.attr("fill", (d) => {return d.data.color;})
					.attr("stroke-width", d => {return d.data.primary ? 2 : 0;})
					.attr("stroke", d => {return d.data.primary ? "black" : "white";})
					.style("cursor", "pointer")	
					.on("click", (d, i, nodes) => {
						scope.selected = d.data;
						scope.$parent.$parent.$digest();
					})

			group
				.append("text")
				.attr("transform", "translate(0, " + (svgSquareDim - svgSquareDim/15) + ")")
				.text(routingData.name);
		})
	}

	return {
		restrict: "E",
		scope: {
			data: "=",
			selected: "="
		},
		link: linkFunction
	};
}]);