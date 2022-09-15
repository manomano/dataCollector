var prefix = document.location.host == "localhost" ? "" : "";

var apiURL = utils.apiURL;
var HTTP_RESOURCES = {
  BASE: prefix + "Api/",
  //AUTH: "https://data-collector-server.napr.gov.ge/" + "auth/"
  //AUTH: "http://10.11.11.215:8080/" + "auth/"
  AUTH: currentConnections.AUTH,
};

(function () {
  angular
    .module("datacollection.main")
    .config(function ($authProvider) {
      $authProvider.tokenName = "accessToken";
      $authProvider.storageType = "localStorage";
      //$authProvider.tokenHeader = 'Authorization';
      //$authProvider.tokenType = 'Bearer';
      $authProvider.tokenPrefix = "dataCollection";
      $authProvider.loginUrl = HTTP_RESOURCES.AUTH + "login";
    })
    .config(function ($mdThemingProvider) {
      $mdThemingProvider
        .theme("default")
        .primaryPalette("teal", {
          default: "400",
          "hue-1": "300",
          "hue-2": "200",
        })
        .accentPalette("red", {
          default: "500",
        })
        .warnPalette("red");
      //.dark(); // :)
    })
    .config([
      "cfpLoadingBarProvider",
      function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 100;
        cfpLoadingBarProvider.parentSelector = "#datacon-loading-bar-container";
      },
    ])
    .config([
      "$compileProvider",
      function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      },
    ])
    .config([
      "$locationProvider",
      function ($locationProvider) {
        // $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
        /*    $locationProvider.html5Mode({
             enabled: true,
             requireBase: false,
             rewriteLinks: false
             });*/
      },
    ])
    .config(function ($mdDateLocaleProvider) {
      $mdDateLocaleProvider.formatDate = function (date) {
        if (date !== null) {
          if (date.getMonthName == undefined) {
            date.getMonthName = function () {
              var monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              return monthNames[this.getMonth()];
            };
          }
          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();
          return day + " " + date.getMonthName() + " " + year;
        }
      };
    });
})();

(function () {
  var routeConfig = function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: prefix + "App/home.html",
        controller: "MainCtrl",
      })

      /*  .when("/", {
                templateUrl: prefix + "App/Panel/panel.html",
                controller: "MainPanelCtrl"
            })*/
      .when("/login", {
        templateUrl: prefix + "App/Authentication/authentication.html",
        controller: "AuthenticationCtrl",
      })
      .when("/main", {
        templateUrl: prefix + "App/Panel/panel.html",
        controller: "MainPanelCtrl",
      });
  };

  routeConfig.$inject = ["$routeProvider"];
  angular.module("datacollection.main").config(routeConfig);
})();
