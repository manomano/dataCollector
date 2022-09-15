(function () {
    var buildingEntranceControllerService = function ($rootScope,DrawingControllerService, $mdDialog, ParcelService, FormService,MessagingService, simpleObjectService) {
        var isactive = false;
        var me  = this;


        function selectFilter(feature, layer) {
            return layer.get('name')=='buildingEntrances' && feature.get('BUILDING_ID')== me.building_id
        }

        var fedit = function (par) {
            me.backFromEdit(par);
        };



        function setIsactive(act){
            isactive = act;
            if(act){
                //me.featureSelector = new WFSFeatureSelector($rootScope.map.map, $rootScope.map.layers, selectFilter);
                me.featureSelector = featureSelectorFactory($rootScope.map.map, $rootScope.map.layers, $rootScope.layerOrg.selectFilter({layers:['buildingEntrances', 'all'],layerName:'buildingEntrances', key:'BUILDING_ID', value:me.building_id}) );
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


        var f = function (par) {
            me.back(par);
        };


        this.layerRefresh  = function(){
            $rootScope.layerOrg.refreshLayers(['buildings','buildingEntrances']);
            me.featureSelector.disable();
            $rootScope.map.defaultMode();

        };

        this.updateToastTitle = function (additionalInfo) {
            $rootScope.listenerObject.currentTitle = 'შენობის შესასვლელების ხაზვა  ' + additionalInfo;
        };

        this.back = function (geometry) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }
            var actualCount = me.getObjectCount();
            me.turnOn();
            me.layerRefresh();
            me.updateToastTitle(actualCount+'/' + me.allowed_count );
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


        function getStatus(){
            return isactive;
        }
        this.init = function (config) {
            this.map = config.map;
            this.building_id = config.building_id;
            this.allowed_count = config.allowed_count;
            this.isLast = config.isLast;
            this.subscriber = new Action();
            this.name = 'buildingEntranceGeometry';
            this.infoName = 'buildingEntranceInfo';
            if(config.featureToSnap){
                this.featureToSnap = config.featureToSnap;
            }
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


        this.next = function () {

            simpleObjectService.getObjectCount('buildingEntrances',{'x':me.building_id,'BUILDING_ID':me.building_id}).then(function (response) {
                if(response.data < me.allowed_count){
                    MessagingService.displayError("შესასვლელების რაოდენობა ნაკლებია მითითებულზე");
                    return;
                }


                simpleObjectService.metadataIsFilled('buildings',me.building_id).then(function (response) {
                    if(!response.data){
                        MessagingService.displayError("ფორმა არ არის შევსებული");
                        return;
                    }


                    setIsactive(false);
                    me.subscriber.trigger("back");
                })
            },function () {

            });


        };

        this.stop = function () {
            this.layerRefresh();
            setIsactive(false);
            this.subscriber.trigger("stop");
        };

        this.getObjectCount = function () {

            return $rootScope.layerOrg.getObjectCount('buildingEntrances',{'x':me.building_id,'BUILDING_ID':me.building_id});

        };



        this.metadata_is_filled = function () {

            return $rootScope.layerOrg.metadataIsFilled('buildings',me.building_id);

        }


        this.draw = function () {
            if(me.allowed_count <=  me.getObjectCount()){
                MessagingService.displayError("შენობის შესასვლელების ოდენობა ემთხვევა მითითებულს, მეტის დამატების უფლება არ გაქვთ");
                return;
            }
            setIsactive(false);
            DrawingControllerService.init(this.name, this.featureToSnap, this.building_id);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);
        };

        this.selectGeometry = function(){
            me.featureSelector.enable(true);
        };

        this.cancelSelection = function(){
            me.featureSelector.disable();
        };


        this.edit_general = function (event) {

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
                    me.deleteObject(event);
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
                this.featureToSnap = $rootScope.layerOrg.search("buildings", me.building_id);
            }
            DrawingControllerService.initEdit(this.name, feature,  this.featureToSnap, true);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,fedit);
        };

        this.deleteObject = function (ev) {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }
            var id = me.featureSelector.getSelectedFeatures()[0].getProperties()['ID'];
            var actualCount = me.getObjectCount();
            var confirm = $mdDialog.confirm()
                .title('წაშლა')
                .textContent('გნებავთ ობიექტის წაშლა?.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('წაშლა!')
                .cancel('გაუქმება');

            $mdDialog.show(confirm).then(function() {
                ParcelService.delete_buildingEntrance(id).then(function (response) {
                    me.layerRefresh();
                    actualCount--;
                    me.updateToastTitle(actualCount+'/' + me.allowed_count );
                    MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
                });

            }, function() {

            });



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

                FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:id}, response.data, formCallBack);
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


    buildingEntranceControllerService.$inject = ["$rootScope","DrawingControllerService", "$mdDialog", "ParcelService","FormService","MessagingService","simpleObjectService"];
    angular.module("datacollection.services").service("buildingEntranceControllerService", buildingEntranceControllerService);


})();
