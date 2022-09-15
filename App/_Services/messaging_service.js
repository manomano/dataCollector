(function() {

	var messagingService = function(ngNotify, $location) {

		this.displayError = function(err) {

			var errorMessage = (angular.isObject(err)) ? err.data.message : err;

			ngNotify.set(errorMessage, 'error');
			if (err.status == 401) {
				$location.path('/login');
			}
		}

		this.displaySuccess = function(msg) {

			ngNotify.set(msg, 'success');
		}

	}
	messagingService.$inject = [
		"ngNotify",
		"$location"
	];

	angular.module("datacollection.services").service("MessagingService", messagingService);

})();