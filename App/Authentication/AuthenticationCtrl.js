(function() {

    var controller = function($window, vm, authService, storageService, messagingService, $location, ngNotify) {

        vm.credentials = {};

        vm.signIn = function() {


            var success = function(response) {

                storageService.saveObject('Authorization', response.data);
                $location.path('/main');
                /*authService.getCurrentUser()
                    .then(function(response) {
                        storageService.saveObject('user', response.data);
                        ngNotify.set('გამარჯობა', 'info');
                        $location.path('/main');
                    }, messagingService.displayError);*/
            };

            var failure = function (response) {

                messagingService.displayError('მომხმარებლის სახელი ან პაროლი მცდარია!');
            }

            authService.signIn(vm.credentials).then(success, failure);
        }

    }

    controller.$inject = ["$window","$scope", "authService", "StorageService", "MessagingService", "$location", "ngNotify"];
    angular.module("datacollection.authentication").controller("AuthenticationCtrl", controller);
})();