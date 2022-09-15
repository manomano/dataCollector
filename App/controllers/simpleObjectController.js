
(function () {
    var simpleObjectController = function ($window, $rootScope,StorageService, DrawingControllerService, $mdDialog, simpleObjectService, FormService, MessagingService) {
        var isactive = false;
        var me  = this;

        var fedit = function (par) {
            me.backFromEdit(par);
        };
        function selectFilter(feature, layer) {
            return layer.get('name')=='parcelEntrances' && feature.get('PARCEL_ID')== me.parcel_id;
        }

        function setIsactive(act){
            isactive = act;
            if(act){
                me.updateToastTitle( me.getObjectCount() + "/" + me.allowed_count);
            }
        }

        function formCallBack(parameters) {
            if(!parameters){
                me.layerRefresh();
                me.stop();
                return;
            }

            var parametersToPass = {};
            Object.keys(parameters).forEach(function(key,index) {
                if(parseInt(key)){
                    parametersToPass[key] = parameters[key]
                }
            });

            simpleObjectService.metadata(me.id, parametersToPass, me.serviceName, me.editing).then(function (response) {
                me.layerRefresh();
                me.stop();


                if(typeof(imageUploader)!=='undefined'){

                    imageUploader.openImageUploadingPage(me.id,(me.serviceName=='busStops'?2:3), StorageService.getObject('Authorization').accessToken);
                }

            },function (response) {
                me.layerRefresh();
                me.stop();
                MessagingService.displayError("დაფიქსირდა პრობლემა, გთხოვთ სცადოთ მეტადატის შეყვანა კიდევ ერთხელ!")
            });


        }

        function getStatus(){
            return isactive;
        }
        this.init = function (config) {
            this.map = config.map;
            this.id = config.id;
            this.allowed_count = 1;
            this.subscriber = new Action();
            this.name = config.name;
            this.infoName = config.infoName;
            this.editing = config.editing;
            this.serviceName = config.serviceName;

        };


        var f = function (par) {
            me.back(par);
        };


        this.updateToastTitle = function (additionalInfo) {
            $rootScope.listenerObject.currentTitle = 'POI-ს დასმა  ' + additionalInfo;
        };


        this.layerRefresh  = function(){

            $rootScope.layerOrg.refreshLayers([me.serviceName]);
            $rootScope.map.defaultMode();

        };

        this.back = function (response) {

            if(utils.testArgs(arguments)){
                me.stop();
                return;
            }


            var actualCount = me.getObjectCount();

            me.turnOn();
            me.layerRefresh();
            me.updateToastTitle( actualCount +'/' + me.allowed_count);
            me.id = response.data.properties.ID;

            if(me.serviceName=='pois'){
                FormService.allowDataEntranceHierarchial(me.title, me.infoName, null, formCallBack);
            }else{
                FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:null},null, formCallBack);
            }


            /*simpleObjectService.add(feature.geometry, me.serviceName).then(function (response) {
                me.turnOn();
                me.layerRefresh();
                actualCount++;
                me.updateToastTitle( actualCount +'/' + me.allowed_count);
                me.id = response.data.properties.ID;

                if(me.serviceName=='pois'){
                    FormService.allowDataEntranceHierarchial(me.title, me.infoName, null, formCallBack);
                }else{
                    FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:null},null, formCallBack);
                }


            });*/
        };

        this.backFromEdit  = function (response) {

            if(utils.testArgs(arguments)){
                me.stop();
                return;
            }

            me.turnOn();
            me.layerRefresh();
            me.stop();

          /*  simpleObjectService.edit(me.id, feature.geometry, me.serviceName).then(function (response) {
                me.turnOn();
                me.layerRefresh();
                me.stop();
            });*/
        };

        this.turnOn = function () {
            setIsactive(true);
        };

        this.getStatus = function () {
            return getStatus();
        };


        this.addCallback = function (args, func) {
            this.subscriber.addCallback(args, func);
        };

        this.metadata_is_filled = function () {
            var layers = $rootScope.map.layers.filter(function (p1, p2, p3) {
                return p1.get('name')==me.serviceName
            });


            var feature = layers[0].getSource().getFeatures().filter(function (p1, p2, p3) {
                return p1.get('ID') ==me.id && p1.get('ID') == me.id;
            })[0];

            return feature.get('METADATA_IS_FILLED')

        }


        this.stop = function () {
            setIsactive(false);
            this.subscriber.trigger("stop");

        };

        this.getObjectCount = function () {

            return $rootScope.layerOrg.getObjectCount(me.serviceName,{'ID':me.id, 'x':me.id});

        };
        this.draw = function () {
            if(me.allowed_count <= me.getObjectCount() && !me.editing){
                MessagingService.displayError("გეომეტრია უკვე დატანილია");
                return;
            }

            setIsactive(false);
            DrawingControllerService.init(this.name);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);
        };



        this.editGeometry = function(feature){


            if(!feature){
                return;
            }
            setIsactive(false);
            if(this.name=="trafficSignGeometry"){
                DrawingControllerService.initEdit(this.name, null,null, true,feature.get('ID'));
            }else{
                DrawingControllerService.initEdit(this.name, feature);
            }

            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,fedit);
        };



        this.deleteObject = function (feature, evt) {

            var confirm = $mdDialog.confirm()
                .title('გნებავთ ობიექტის წაშლა?')
                .textContent('გნებავთ ობიექტის წაშლა?')
                .ariaLabel('Lucky day')
                .targetEvent(evt)
                .ok('წაშლა!')
                .cancel('წაშლის გაუქმება');


            $mdDialog.show(confirm).then(function() {

                var id = feature.get('ID');
                var actualCount = me.getObjectCount();
                simpleObjectService.delete(id, me.serviceName).then(function (response) {
                    actualCount--;
                    me.updateToastTitle(actualCount+'/' + me.allowed_count );
                    me.layerRefresh();
                    me.stop();
                    MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
                    $window.location.reload();
                });
            }, function() {
                me.stop();

            });





        }



        this.editMetadata = function (feature) {


            var id = feature.get('ID');

            me.id = id;

            simpleObjectService.getMetadata(id, me.serviceName).then(function (response) {

                //FormService.allowDataEntrance(me.title, me.infoName, response.data, formCallBack);

                FormService.allowDataEntranceHierarchial(me.title, me.infoName, response.data, formCallBack);

            });

        }


    };


    simpleObjectController.$inject = ["$window","$rootScope","StorageService","DrawingControllerService","$mdDialog", "simpleObjectService", "FormService","MessagingService"];
    angular.module("datacollection.services").service("simpleObjectControllerService", simpleObjectController);


})();
