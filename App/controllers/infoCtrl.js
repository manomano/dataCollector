(function () {

    var infoController = function ($sce, $scope, MessagingService, $mdDialog, FormService, simpleObjectService, stepName, metadata,actualChildElementsNum, additional_info) {
        $scope.actualChildElementsNum = actualChildElementsNum;
        //$scope.additional_info = additional_info;
        $scope.titles = {
                "parcels":"ნაკვეთის",
                "buildings":"შენობის",
                "buildingEntrances":"შენობის შესასვლელის",
                "parcelEntrances":"ნაკვეთის შესასვლელის",
                "pois":"POI-ს",
                "trafficSigns": "საგზაო ნიშნის",
                "busStops":"ავტობუსის გაჩერების",
                 "assignments":"ბლოკის"

        };

        var dict = {
            HAS_MAIN_ENTRANCE: 'აქვს მთავარი შესასვლელი',
            INCOMPLETE_BUILDING_IDS: 'დაუსრულებელი შენობების ID-ები',
            MISSING_BUILDINGS_NUM: 'დასახაზი შენობების რაოდენობა ',
            MISSING_FIELD_NAMES:'შეუვსებელი ველები',
            MISSING_ENTRANCES_NUM: 'დასახაზი შესასვლელების ოდენობა'

        }
        $scope.FormTitle = $scope.titles[stepName];
        $scope.photoURLArr = [];
        $scope.images = [];
       /* $scope.id = null;
        if(additional_info.id){
            $scope.id = additional_info.id;
        }*/

        // Thumbnails
        $scope.thumbnails = true;
        $scope.toggleThumbnails = function(){
            $scope.thumbnails = !$scope.thumbnails;
        }

        // Inline
        $scope.inline = false;
        $scope.toggleInline = function(){
            $scope.inline = !$scope.inline;
        }

        // Bubbles
        $scope.bubbles = true;
        $scope.toggleBubbles = function(){
            $scope.bubbles = !$scope.bubbles;
        }

        // Image bubbles
        $scope.imgBubbles = false;
        $scope.toggleImgBubbles = function(){
            $scope.imgBubbles = !$scope.imgBubbles;
        }

        // Background close
        $scope.bgClose = false;
        $scope.closeOnBackground = function(){
            $scope.bgClose = !$scope.bgClose;
        }




        $scope.methods = {};
        $scope.openGallery = function(){
            $scope.methods.open();
        };
        $scope.opened = function(){
            console.info('Gallery opened!');
        }

        $scope.closed = function(){
            console.warn('Gallery closed!');
        }

        $scope.conf = {
            imgAnim : 'fadeup'
        };

        if(['pois', 'busStops', 'trafficSigns'].indexOf(stepName)>=0){
            simpleObjectService.getPhotoIdies(additional_info.id).then(function (response) {
                for(var i in response.data){
                    $scope.photoURLArr.push({url:apiURL+"photos/"+response.data[i], isThumbNail:true});
                    $scope.images.push({
                        id:i+15,
                        url:apiURL+"photos/"+response.data[i],
                        deletable : false
                    })
                }
            },function () {

            });
        }

        $scope.fields = [];
        $scope.metadata = metadata;

        /* for(var prop in $scope.metadata){
            $scope.fields.push({label:prop, value:$scope.metadata[prop]})
        }*/


        for(var i = 0; i < $scope.metadata.length; i++){
            $scope.fields.push({label:$scope.metadata[i]['key'], value:$scope.metadata[i]['value']})
        }



        $scope.getErrors = function () {
            if($scope.fields.length>0){
                return;
            }
            var yesNo = ['არა','კი'];

            for(prop in $scope.metadata){
                let val = typeof $scope.metadata[prop] === "boolean"?yesNo[($scope.metadata[prop]+0)]:$scope.metadata[prop];
                $scope.fields.push({label:dict[prop], value:typeof $scope.metadata[prop]=='object'?$scope.metadata[prop].join(","):val})
            }
        }


        $scope.getErrors();

        $scope.cancel = function () {
            $mdDialog.cancel($scope.parameters);
        }






    }

    infoController.$inject = ["$sce","$scope", "MessagingService", "$mdDialog","FormService","simpleObjectService", "stepName", "metadata","actualChildElementsNum","additional_info"];
    angular.module('datacollection.mypanel').controller("infoCtrl", infoController);


})();
