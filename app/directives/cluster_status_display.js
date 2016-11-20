app.directive("clusterDisplay", ["$window", function($window){

	var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

	var linkFunction = function(scope, element, attr){

		scope.$watch(() => {return scope.data}, (transformedData, oldTransformedData) => {

			if (transformedData != oldTransformedData) {

				//Sort by node and for each node sort the corresponding array by index name.
				var nodes = [];
				for (key in transformedData) {
					nodes.push(key);
					transformedData[key] = _.sortBy(transformedData[key], (d) => d.index);
				}
				nodes.sort();

				let horizontalWidth = $window.innerWidth * (6/10);
				let horizontalCount = 4;

				let svgWidth = horizontalWidth;

				let spacePerNode = (horizontalWidth / horizontalCount);

				let svgHeight = spacePerNode;

				//Use 3/4 of the space for the drawing.
				let outerRadius = (1/2) * ((4/5) * spacePerNode);

				let innerRadius = outerRadius / 2;
				let padAngle = outerRadius / 10000;
				let cornerRadius = outerRadius / 10;

				d3.select(element[0]).select("svg").remove();

				let svg = d3.select(element[0])
					.append("svg")
						.attr("width", svgWidth)
						.attr("height", svgHeight);

				let arc = d3.arc()
							.innerRadius(innerRadius)
							.outerRadius(outerRadius)
							.padAngle(padAngle)
							.cornerRadius(cornerRadius)


				let xPosition = 0;

				for (let n = 0; n < nodes.length; n++) {

					if (xPosition == horizontalCount) {
						xPosition = 0;
						svgHeight += spacePerNode;
						svg.attr("height", svgHeight)
					}

					
					let arcs = d3.pie().value(d => 1)(transformedData[nodes[n]]);

					for (let i = 0; i < arcs.length; i++) {
						arcs[i].data = transformedData[nodes[n]][i];
					}

					let group = svg.append("g");

					group
						.selectAll("path")
						.data(arcs)
						.enter()
							.append("path")
							.attr("d", d => {return arc(d)})
							.attr("transform", "translate(" + (outerRadius + (xPosition * spacePerNode)) + ", " 
								+ (svgHeight - spacePerNode/2) + ")")
							.attr("fill", (d) => {
								let index = d.data.index;
								return colorScale(index);
							})
							.attr("stroke-width", d => {
								if (d.data.allocation == "primary") {
									return 2;
								}
								return 0;
							})
							.attr("stroke", d => {
								if (d.data.allocation == "primary") {
									return "black";
								}
								return "white";
							})
							.style("cursor", "pointer")	
							.on("click", (d, i, nodes) => {
								scope.selected = d.data;
								scope.$parent.$digest();
							})

					group
					.append("text")
					.attr("transform", "translate(" + (xPosition * spacePerNode)
						  + ", " + svgHeight + ")")
					.text(nodes[n]);

					xPosition++;
				}
			}			
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