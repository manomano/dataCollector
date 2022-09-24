(function () {
  var controller = function (
    $rootScope,
    $scope,
    MessagingService,
    $mdDialog,
    assignmentService,
    assignment_id,
    serviceName
  ) {
    $scope.assignment_id = assignment_id;
    $scope.serviceName = serviceName;
    console.log(serviceName);

    $scope.titles = {
      assignments: "დავალებების გრიდი",
      roadAssignments: "გზები",
    };

    assignmentService
      .checkForErrors($scope.serviceName, $scope.assignment_id)
      .then(function (response) {
        $scope.parcelErrorList = response.data.INCOMPLETE_PARCEL_IDs
          ? response.data.INCOMPLETE_PARCEL_IDs
          : [];

        $scope.MUST_BE_COPIED = response.data.MUST_BE_COPIED
          ? response.data.MUST_BE_COPIED
          : [];
        $scope.MULTIPLE_TIMES_COPIED = [];
        for (var prop in response.data.MULTIPLE_TIMES_COPIED) {
          $scope.MULTIPLE_TIMES_COPIED.push({
            existingParcelId: prop,
            parcelIds: response.data.MULTIPLE_TIMES_COPIED[prop],
          });
        }

        $scope.busStopErrorList = response.data.INCOMPLETE_BUS_STOP_IDS
          ? response.data.INCOMPLETE_BUS_STOP_IDS
          : [];
        $scope.trafficSignErrorList = response.data.INCOMPLETE_TRAFFIC_SIGN_IDS
          ? response.data.INCOMPLETE_TRAFFIC_SIGN_IDS
          : [];
        $scope.allErrors =
          $scope.parcelErrorList.length ||
          $scope.MUST_BE_COPIED.length ||
          $scope.MULTIPLE_TIMES_COPIED ||
          $scope.busStopErrorList.length ||
          $scope.trafficSignErrorList.length;
      });

    $scope.goTo = function (id, layerName) {
      /*var parcelLayer = $rootScope.map.layers.filter(function (p1, p2, p3) {
                return p1.get('name') ==$scope.serviceName;
            })[0];
*/
      var feature = $rootScope.layerOrg.search(layerName, id);
      /*
            var feature = ((parcelLayer.getSource()).getFeatures()).filter(function (p1, p2, p3) {
                return p1.get('ID') == id;
            })[0];
			*/

      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var extent = feature.getGeometry().getExtent();
        $rootScope.map.map.getView().fit(extent);
        $mdDialog.cancel();

        /* var x = extent[2] - extent[0];
                var y = extent[3] - extent[1];
                var coords = [x,y];
                $rootScope.map.map.getView().animate({center: coords, zoom: 10});*/
      }
    };

    $scope.cancel = function () {
      $mdDialog.cancel($scope.parameters);
    };
  };
  controller.$inject = [
    "$rootScope",
    "$scope",
    "MessagingService",
    "$mdDialog",
    "assignmentService",
    "assignment_id",
    "serviceName",
  ];
  angular
    .module("datacollection.mypanel")
    .controller("assignmentErrorsCtrl", controller);
})();
