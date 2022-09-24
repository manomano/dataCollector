(function () {
  var service = function ($auth, http, StorageService) {
    this.signIn = function (credentials) {
      return $auth.login(credentials);
    };

    this.signOut = function () {
      return http.delete(HTTP_RESOURCES.AUTH);
      $auth.logout();
    };

    this.isSignedIn = function () {
      return $auth.isAuthenticated();
    };

    this.getCurrentUser = function () {
      return SessionStorage.getValue("Authorization");
      //return http.get(HTTP_RESOURCES.AUTH);
    };
  };

  service.$inject = ["$auth", "$http", "StorageService"];
  angular
    .module("datacollection.authentication")
    .service("authService", service);
})();
