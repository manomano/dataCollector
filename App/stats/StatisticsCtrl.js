(function () {
    let statisticsController = function ($scope, $mdDialog, simpleObjectService, authService, $auth) {
        $scope.params = {};
        $scope.data = [];
        $scope.places = []
        $scope.cancel = function () {
            $mdDialog.cancel($scope.parameters);
        }
        const today= new Date();

        function addZero(figure){

            if(figure<10) {
                return '0' + figure.toString()
            }

            return figure.toString();

        }

        simpleObjectService.getNewPlaces().then(function (response) {
            $scope.places = response.data;
        })

        let from = today.getFullYear()+'-'+addZero(today.getMonth()-1) + '-'+ addZero(today.getDay());
        let till = '2020'+'-'+addZero(today.getMonth()) + '-'+addZero(today.getDay());
        $scope.params.from = from;
        $scope.params.till = till;
        $scope.params.group = 1;
        $scope.params.place = 89;
        let fromDateObject = new Date(today.getFullYear(), today.getMonth()-1, today.getDay());
        let tillDateObject = new Date(today.getFullYear(), today.getMonth(), today.getDay());
        $scope.fromField = fromDateObject;
        $scope.tillField = tillDateObject;



        $scope.getData = function(){



            $scope.params.from = $scope.fromField.getFullYear() + '-' + addZero($scope.fromField.getMonth()) + '-'+ addZero($scope.fromField.getDate());
            $scope.params.till = $scope.tillField.getFullYear() + '-' + addZero($scope.tillField.getMonth()) + '-'+ addZero($scope.tillField.getDate());

            console.log($scope.params);
            simpleObjectService.getStatistics($scope.params).then(function (response) {
                $scope.data = response.data;
            },function () {

            })
        }

        $scope.getData();




    }

    statisticsController.$inject = ["$scope","$mdDialog","simpleObjectService", "authService", "$auth"];
    angular.module("datacollection.mypanel").controller("StatisticsCtrl", statisticsController);
})();
