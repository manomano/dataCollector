(function () {
  var Directive = function () {
    return {
      restrict: "E",
      templateUrl: "App/_Directives/templates/ownerPn.html",
      require: "?ngModel",
      scope: { data: "=" },
      link: function ($scope, element, attrs, ngModel) {
        $scope.addElement = function () {
          $scope.data.push({ OWNER: "" });
        };

        $scope.removeElement = function (index) {
          $scope.data.splice(index, 1);
        };

        if ($scope.data && typeof $scope.data == "object") {
          if ($scope.data.length == 0) {
            $scope.data.push({ OWNER: "" });
          }
        }
      },
    };
  };

  angular
    .module("datacollection.directives")
    .directive("ownerPn", ["$q", Directive]);
})();

(function () {
  var Directive = function () {
    return {
      restrict: "E",
      templateUrl: "App/_Directives/templates/manyPhones.html",
      require: "?ngModel",
      scope: { rows: "=" },
      link: function ($scope, element, attrs, ngModel) {
        $scope.unics = {};
        $scope.addElement = function () {
          $scope.rows.push({ phone: "" });
        };

        $scope.verifyDuplicate = function (that, rec, index) {
          if (
            $scope.unics.hasOwnProperty(rec.phone) &&
            $scope.unics[rec.phone] !== index
          ) {
            rec.phone = "";
          } else {
            $scope.unics[rec.phone] = index;
          }
        };

        $scope.removeElement = function (index) {
          delete $scope.unics[$scope.rows[index].phone];
          for (let key in $scope.unics) {
            if ($scope.unics[key] > index) {
              $scope.unics[key] -= 1;
            }
          }
          $scope.rows.splice(index, 1);
        };

        if (!$scope.rows || !$scope.rows.length) {
          $scope.rows = [];
          $scope.rows.push({ phone: "" });
        }
      },
    };
  };

  angular
    .module("datacollection.directives")
    .directive("repetitivePhones", ["$q", Directive]);
})();
