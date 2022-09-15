(function () {
    var flowControllerService = function ($rootScope, $mdToast, initialControllerService, parcelControllerService, parcelEntranceControllerService, buildingControllerService, buildingEntranceControllerService) {
        var me = this;
        var f = function (par) {
            me.next(par);
        }


        this.init = function (map) {
            $rootScope.listenerObject = {};
            $rootScope.listenerObject.currentTitle = 'ნაკვეთის ხაზვა';
            initialControllerService.init();
            $rootScope.parcel_id = null;
            initialControllerService.turnOn();
            initialControllerService.subscriber.addCallback(initialControllerService, this.next);
        }

        this.showToast = function (title) {
            var toast = $mdToast.show({
                hideDelay: 0,
                position: 'top center',
                controller: 'ToastCtrl',
                templateUrl: prefix + 'App/views/toast_template.html',
                locals: {
                    title: ''
                }
            });
        };
        this.next = function (parameters) {
            var steps = ["initialController", "parcelController", "parcelEntranceController", "buildingController"];


            var stepControllerIndex = steps.indexOf(parameters.who);
            if (parameters.parcel_id) {
                $rootScope.parcel_id = parameters.parcel_id;
                me.parcelEntrances_count = parameters.parcelEntrances_count;
                me.buildings_count = parameters.buildings_count;
            }

            stepControllerIndex++;

            if (stepControllerIndex == steps.length) {

                stepControllerIndex = 0;
            }

            if (stepControllerIndex == 0) {
                me.parcelEntrances_count = null;
                me.buildings_count = null;
                me.parcel_id = null;
                $rootScope.parcel_id = null;

                initialControllerService.turnOn();
                $mdToast.hide();
            } else if (stepControllerIndex == 1) {

                    parcelControllerService.init({parcel_id: parameters.parcel_id,parcelEntrances_count:me.parcelEntrances_count,buildings_count:me.buildings_count });
                    parcelControllerService.turnOn();
                    parcelControllerService.subscriber.addCallback(parcelControllerService, f);
                    me.showToast();
            } else if (stepControllerIndex == 2) {

                parcelEntranceControllerService.init({
                    parcel_id: $rootScope.parcel_id,
                    allowed_count: me.parcelEntrances_count,
                    featureToSnap:parameters.parcelFeature,
                    isLastStep: parameters.buildings_count==0,
                    addedBuildingsCount:parameters.addedBuildingsCount
                });
                parcelEntranceControllerService.turnOn();
                parcelEntranceControllerService.subscriber.addCallback(parcelEntranceControllerService, f);
            } else if (stepControllerIndex == 3) {
                buildingControllerService.init({parcel_id: $rootScope.parcel_id, allowed_count: me.buildings_count});
                buildingControllerService.turnOn();
                buildingControllerService.subscriber.addCallback(buildingControllerService, f);
            }


        }
    }


    flowControllerService.$inject = ["$rootScope", "$mdToast", "initialControllerService", "parcelControllerService", "parcelEntranceControllerService", "buildingControllerService", "buildingEntranceControllerService"];
    angular.module("datacollection.services").service("flowControllerService", flowControllerService);


})();
