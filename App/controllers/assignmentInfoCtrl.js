/**
 * Created by mjaparidze on 8/9/2018.
 */

(function () {
  var controller = function (
    $scope,
    MessagingService,
    $mdDialog,
    assignmentService,
    params,
    serviceName
  ) {
    $scope.params = params;
    $scope.type = serviceName == "assignment" ? "გრიდი" : "გზები";
    $scope.fields = [];
    $scope.dict = {
      id: "id",
      status: "სტატუსი",
      userID: "მომხმარებლის id",
      group_id: "ჯგუფის id",
      username: "მომხმარებელი",
      name: "სახელი",
      surname: "გვარი",
    };
    $scope.statuses = {
      STARTING: "გაუცემელი",
      DELAYED: "დაპაუზებული",
      ONGOING: "მიმდინარე",
    };
    for (var key in $scope.params) {
      if ($scope.params[key] && key !== "geometry") {
        $scope.fields.push({
          label: $scope.dict[key],
          value:
            key == "status"
              ? $scope.statuses[$scope.params[key]]
              : $scope.params[key],
        });
      }
    }

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  };

  controller.$inject = [
    "$scope",
    "MessagingService",
    "$mdDialog",
    "assignmentService",
    "params",
    "serviceName",
  ];
  angular
    .module("datacollection.mypanel")
    .controller("assignmentInfoCtrl", controller);
})();
