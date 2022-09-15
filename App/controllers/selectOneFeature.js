(function () {
  var controller = function ($scope, MessagingService, $mdDialog, features) {
    $scope.features = features;
    $scope.selected = null;

    $scope.dictionary = {
      parcels: "ნაკვეთი",
      buildings: "შენობა",
      buildingEntrances: "შენობის შესასვლეი ",
      parcelEntrances: "ნაკვეთის შესასვლელი",
      pois: "პოი",
      trafficSigns: "საგზაო ნიშანი",
      busStops: "ავტობუსის გაჩერება",
      parcel: "ნაკვეთი",
      building: "შენობა",
      buildingEntrance: "შენობის შესასვლეი ",
      parcelEntrance: "ნაკვეთის შესასვლელი",
      poi: "პოი",
      trafficSign: "საგზაო ნიშანი",
      busStop: "ავტობუსის გაჩერება",
      existingParcels: "არსებული ნაკვეთი",
      existingBuildings: "არსებული შენობა",
      existingParcel: "არსებული ნაკვეთი",
      existingBuilding: "არსებული შენობა",
      assignment: "ბლოკი",
      assignments: "ბლოკი",
      roadAssignment: "გზა",
      roadAssignments: "გზა",
    };

    $scope.cancel = function () {
      $mdDialog.cancel($scope.selected);
    };

    $scope.save = function () {
      if (!$scope.selected) {
        return;
      }

      $mdDialog.hide($scope.selected);
    };
  };
  controller.$inject = ["$scope", "MessagingService", "$mdDialog", "features"];
  angular
    .module("datacollection.mypanel")
    .controller("selectorCtrl", controller);
})();
