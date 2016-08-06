app.config(["$routeProvider", function($routeProvider){
	$routeProvider.
		when("/start", {
			templateUrl: "../views/start_view.html",
			controller: "analysisController"
		}).
		when("/analysis", {
			templateUrl: "../views/analysis_view.html",
			controller: "analysisController"
		}).
		when("/fields", {
			template: "",
			controller: "mainController"
		}).
		when("/templates", {
			template: "",
			controller: "mainController"
		}).
		when("/maintenance", {
			templateUrl: "../views/maintenance_view.html",
			controller: "maintenanceController"
		}).
		otherwise("/start")
}])