
(function () {
    var parcelEntranceControllerService = function ($rootScope,DrawingControllerService, $mdDialog, ParcelService, FormService, MessagingService, simpleObjectService) {
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
                //me.featureSelector = new WFSFeatureSelector($rootScope.map.map, $rootScope.map.layers, selectFilter);
                me.featureSelector = featureSelectorFactory($rootScope.map.map, $rootScope.map.layers, $rootScope.layerOrg.selectFilter({layers:['parcelEntrances','all'],layerName:'parcelEntrances', key:'PARCEL_ID', value:me.parcel_id}) );
                me.updateToastTitle( me.getObjectCount() + "/" + me.allowed_count);
            }else{
                me.featureSelector.disable();
                $rootScope.map.map.removeInteraction(me.featureSelector.selectInteraction);
                me.featureSelector = null;
            }
        }

        function formCallBack(parameters) {
            if(!parameters){
                return;
            }

            me.layerRefresh();

        }

        function getStatus(){
            return isactive;
        }
        this.init = function (config) {
            this.map = config.map;
            this.parcel_id = config.parcel_id;
            this.allowed_count = config.allowed_count;
            this.subscriber = new Action();
            this.name = 'parcelEntranceGeometry';
            this.infoName = 'parcelEntranceInfo';
            this.isLastStep = config.isLastStep;
            this.addedBuildingsCount = config.addedBuildingsCount;
            if(config.featureToSnap){
                this.featureToSnap = config.featureToSnap;
            }
        };


        var f = function (par) {
            me.back(par);
        };


        this.updateToastTitle = function (additionalInfo) {
            $rootScope.listenerObject.currentTitle = 'ნაკვეთის შესასვლელების ხაზვა  ' + additionalInfo;
        };


        this.layerRefresh  = function(){

            $rootScope.layerOrg.refreshLayers(['parcels', 'parcelEntrances']);

            me.featureSelector.disable();
            $rootScope.map.defaultMode();

        };

        this.back = function (geometry) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }


            var actualCount = me.getObjectCount();
            me.turnOn();
            me.layerRefresh();
            me.updateToastTitle( actualCount +'/' + me.allowed_count);
            me.id = geometry.ID;
            FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:me.id}, null, formCallBack);

        };

        this.backFromEdit  = function (geometry) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }

            me.turnOn();
            me.layerRefresh();
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
            return $rootScope.layerOrg.metadataIsFilled('parcels',me.parcel_id);
        }

        this.next = function () {
            simpleObjectService.getObjectCount('parcelEntrances',{'x':me.parcel_id,'PARCEL_ID':me.parcel_id}).then(function (response) {
                if(response.data < me.allowed_count){
                    MessagingService.displayError("შესასვლელების რაოდენობა ნაკლებია მითითებულზე");
                    return;
                }
                if(me.isLastStep && me.addedBuildingsCount==0){
                    me.stop();
                    return;
                }

                simpleObjectService.metadataIsFilled('parcels',me.parcel_id).then(function (response) {
                    if(!response.data){
                        MessagingService.displayError("ფორმა არ არის შევსებული");
                        return;
                    }

                    setIsactive(false);
                    me.subscriber.trigger({who:"parcelEntranceController"});
                });

            },function () {

            });


        };
        this.stop = function () {
            this.layerRefresh();
            setIsactive(false);
            this.subscriber.trigger("stop");
        };

        this.getObjectCount = function () {

            return $rootScope.layerOrg.getObjectCount('parcelEntrances',{'x':me.parcel_id,'PARCEL_ID':me.parcel_id});

        };
        this.draw = function () {
            if(me.allowed_count <= me.getObjectCount()){
                MessagingService.displayError("ნაკვეთის შესასვლელების ოდენობა ემთხვევა მითითებულს, მეტის დამატების უფლება არ გაქვთ");
                return;
            }

            setIsactive(false);
            if(!this.featureToSnap){
                this.featureToSnap = $rootScope.layerOrg.search("parcels", me.parcel_id);
            }
            DrawingControllerService.init(this.name, this.featureToSnap, this.parcel_id);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);
        };

        this.selectGeometry = function(){
            me.featureSelector.enable(true);
        };

        this.cancelSelection = function(){
            me.featureSelector.disable();
        };


        this.edit_general = function () {

            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('არაფერია მონიშნული');
                return;
            }

            if(me.featureSelector.getSelectedFeatures().length>1){
                me.split();
                MessagingService.displayError('საჭიროა მხოლოდ ერთი ობიექტის მონიშვნა');
                return;
            }


            var feature = me.featureSelector.getSelectedFeatures()[0].clone()
            if(!feature){
                return;
            }

            $mdDialog.show(
                {
                    title: '',
                    width: 500,
                    controller: 'editOptionsCtrl',
                    templateUrl: prefix + 'App/views/edit_options.html',
                    targetEvent: event,
                    clickOutsideToClose: false
                }
            ).then(function (option) {
                if(option=='geometry'){
                    me.editGeometry();
                }else if(option=='metadata'){
                    me.editMetadata();
                }else{
                    me.deleteObject();
                }
            },function () {

            });

        }





        this.editGeometry = function(){

            var feature = me.featureSelector.getSelectedFeatures()[0].clone()
            if(!feature){
                return;
            }

            setIsactive(false);

            if(!this.featureToSnap){
                this.featureToSnap = $rootScope.layerOrg.search("parcels", me.parcel_id);
            }

            DrawingControllerService.initEdit(this.name, feature, this.featureToSnap, true);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,fedit);
        };



        this.deleteObject = function (ev) {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }



            var confirm = $mdDialog.confirm()
                .title('წაშლა')
                .textContent('გნებავთ ობიექტის წაშლა?.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('წაშლა!')
                .cancel('გაუქმება');

            $mdDialog.show(confirm).then(function() {

                var id = me.featureSelector.getSelectedFeatures()[0].getProperties()['ID'];
                var actualCount = me.getObjectCount();
                ParcelService.delete_parcelEntrance(id).then(function (response) {

                    actualCount--;
                    me.updateToastTitle(actualCount+'/' + me.allowed_count );
                    me.layerRefresh();
                    MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
                });
            }, function() {

            });



           /* var id = me.featureSelector.getSelectedFeatures()[0].get('ID');
            var actualCount = me.getObjectCount();
            ParcelService.delete_parcelEntrance(id).then(function (response) {

                actualCount--;
                me.updateToastTitle(actualCount+'/' + me.allowed_count );
                me.layerRefresh();
                MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
            });*/
        }



        this.editMetadata = function () {

            if(me.featureSelector.getSelectedFeatures().length>1){
                MessagingService.displayError('საჭიროა მხოლოდ ერთი ობიექტის მონიშვნა');
                return;
            }
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }
            var id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            me.id = id;

            ParcelService.getMetadata(this.infoName,id).then(function (response) {

                FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:me.id}, response.data, formCallBack);
            });

        };

        this.split = function () {

            var features = this.featureSelector.getSelectedFeatures();

            var FeatureArr = [];
            features.map(x=>FeatureArr.push({name:(x.get('featureType') || x.get('name')), id:x.get('ID')}));



            $mdDialog.show(
                {
                    title: '',
                    width: 500,
                    controller: 'selectorCtrl',
                    templateUrl: prefix + 'App/views/selectOneFeature.html',
                    locals: {
                        features:FeatureArr
                    },
                    targetEvent: event,
                    clickOutsideToClose: false
                }
            ).then(function (id) {
                //aq unda wavshalo
                var selected  = features.find(function (x) {
                    return x.get('ID')==id;
                })
                me.featureSelector.clearSelection();
                me.featureSelector.selectFeature(selected);

            });
        }


    };


    parcelEntranceControllerService.$inject = ["$rootScope","DrawingControllerService","$mdDialog", "ParcelService", "FormService","MessagingService", "simpleObjectService"];
    angular.module("datacollection.services").service("parcelEntranceControllerService", parcelEntranceControllerService);


})();