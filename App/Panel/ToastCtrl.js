var toastController = function (
  $rootScope,
  $scope,
  $mdToast,
  $mdDialog,
  title
) {
  var isDlgOpen = true;
  $rootScope.$watch(
    "listenerObject.currentTitle",
    function (newValue, oldValue) {
      $scope.title = newValue;
    }
  );

  $scope.title = title;
  $scope.closeToast = function () {
    // if (isDlgOpen) return;

    $mdToast.hide().then(function () {
      isDlgOpen = false;
    });
  };

  $scope.openMoreInfo = function (e) {
    if (isDlgOpen) return;
    isDlgOpen = true;

    /*$mdDialog
            .show($mdDialog
                .alert()
                .title('More info goes here.')
                .textContent('Something witty.')
                .ariaLabel('More info')
                .ok('Got it')
                .targetEvent(e)
            )
            .then(function() {
                isDlgOpen = false;
            });*/
  };
};

toastController.$inject = [
  "$rootScope",
  "$scope",
  "$mdToast",
  "$mdDialog",
  "title",
];

angular
  .module("datacollection.mypanel")
  .controller("ToastCtrl", toastController);
