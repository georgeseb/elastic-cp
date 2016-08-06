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
			template: "",
			controller: "mainController"
		}).
		when("/index", {
			templateUrl: "../views/index_view.html",
			controller: "indexController"
		}).
		otherwise("/start")
}])