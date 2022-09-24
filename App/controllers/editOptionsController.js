(function () {
  var controller = function ($scope, MessagingService, $mdDialog) {
    $scope.theOption = "geometry";

    $scope.cancel = function () {
      $mdDialog.cancel(null);
    };

    $scope.save = function () {
      $mdDialog.hide($scope.theOption);
    };
  };
  controller.$inject = ["$scope", "MessagingService", "$mdDialog"];
  angular
    .module("datacollection.mypanel")
    .controller("editOptionsCtrl", controller);
})();
