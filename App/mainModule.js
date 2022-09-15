(function() {
    var dependencies = [
        "ngMessages",
        "ngSanitize",
        "ngAria",
        "ngRoute",
        "ngAnimate",
        "satellizer",
        "ngNotify",
        "angular-loading-bar",
        "datacollection.services",
        "datacollection.directives",
        "datacollection.authentication",
        "datacollection.mypanel",
        "ngMaterial",
        "md.time.picker",
        "thatisuday.ng-image-gallery"
    ];
    angular.module("datacollection.main", dependencies);
})();

(function() {

    var controller = function($window, vm, $rootScope, authService, $auth, StorageService,  messagingService, $location) {

        var isSigned = true;
        if (!authService.isSignedIn()) {
            $location.path('/login');
            isSigned = false;
            //return;
        }

        $rootScope.$on('logout', function() {

            var successLogout = function(signInResponse) {
                storageService.remove('user');
                $auth.logout();
                messagingService.displaySuccess('კარგად ბრძანდებოდეთ');
                $location.path('/login');
            };

            authService.signOut().then(successLogout, messagingService.displayError);
        });



        $rootScope.$on('cfpLoadingBar:loading', function(event, data) {
            vm.loadingInProgress = true;
        });

        $rootScope.$on('cfpLoadingBar:loaded', function(event, data) {
            vm.loadingInProgress = false;
        });



        if(isSigned){
            $location.path("/main");
        }


    }

    controller.$inject = ["$window", "$scope", "$rootScope", "authService", "$auth", "StorageService", "MessagingService", "$location"];

    angular.module("datacollection.main").controller("MainCtrl", controller);

})();
