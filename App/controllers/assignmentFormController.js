(function () {
  var controller = function (
    $scope,
    MessagingService,
    $mdDialog,
    assignmentService,
    user_id,
    assignment_ids,
    serviceName
  ) {
    $scope.user_id = user_id;
    $scope.assignment_ids = assignment_ids;
    $scope.serviceName = serviceName;

    console.log("assignment:", $scope.assignment_ids);

    assignmentService.getAllUsers($scope.serviceName).then(function (response) {
      $scope.users = response.data.AVAILABLE_USER_IDs;
    });

    if (!assignment_ids.length) {
      assignmentService
        .getInfo($scope.serviceName, $scope.assignment_ids)
        .then(function (response) {
          $scope.info = response.data;
        });
    }

    $scope.cancel = function () {
      $mdDialog.cancel($scope.parameters);
    };

    $scope.save = function () {
      var param = { userId: $scope.user_id };
      if (serviceName == "roadAssignments") {
        param.assignmentIds = $scope.assignment_ids;
      } else {
        param.assignmentId = $scope.assignment_ids;
      }

      assignmentService.assignUser($scope.serviceName, param).then(
        function () {
          MessagingService.displaySuccess("ჩანაწერი წარმატებით დაემატა!");
          $mdDialog.hide();
        },
        function () {
          MessagingService.displayError("დაფიქსირდა შეცდომა!");
        }
      );
    };
  };
  controller.$inject = [
    "$scope",
    "MessagingService",
    "$mdDialog",
    "assignmentService",
    "user_id",
    "assignment_ids",
    "serviceName",
  ];
  angular
    .module("datacollection.mypanel")
    .controller("assignmentFormCtrl", controller);
})();
