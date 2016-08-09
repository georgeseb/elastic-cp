app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
		when("/start", {
			templateUrl: "../views/start_view.html",
			controller: "startController"
		}).
		when("/analysis", {
			templateUrl: "../views/analysis_view.html",
			controller: "analysisController"
		}).
		when("/cluster", {
			templateUrl: "../views/cluster_view.html",
			controller: "clusterController"
		}).
		when("/index", {
			templateUrl: "../views/index_view.html",
			controller: "indexController"
		}).
		otherwise("/start")
}])