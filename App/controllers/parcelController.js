(function () {
    var parcelControllerService = function ($rootScope, DrawingControllerService, $mdDialog, ParcelService, FormService, MessagingService, simpleObjectService) {

        var isactive = false;
        var me  = this;
        function formCallBack(parameters) {

            if(!parameters){
                return;
            }

            me.buildings_count = parameters.BUILDINGS_NUM;
            me.parcelEntrances_count = parameters.PARCEL_ENTRANCES_NUM;
            me.layerRefresh();
        }
        
        function selectFilter(feature, layer) {
            return (layer.get('name')=='parcels' && feature.get('PARCEL_ID')== me.parcel_id)  || !me.parcel_id && layer.get('name')=='existingParcels';
        }
        
        function setIsactive(act){
            isactive = act;
            if(act){


               me.featureSelector = featureSelectorFactory($rootScope.map.map, $rootScope.map.layers, $rootScope.layerOrg.selectFilter({layers :['existingObjects', 'parcels','all','existingParcels'], layerName:'parcels', key:'ID', value:me.parcel_id}) );

               me.updateToastTitle( me.getObjectCount() + "/1");
            }else{
                me.featureSelector.disable();
                $rootScope.map.map.removeInteraction(me.featureSelector.selectInteraction);
            }
        }

        function getStatus(){
            return isactive;
        }
        this.init = function (config) {
            this.subscriber = new Action();
            this.name = 'parcelGeometry';
            this.title = 'ინფორმაცია ნაკვეთზე';
            this.infoName = 'parcelInfo';
            this.parcel_id = config?config.parcel_id:null;
            this.buildings_count = config?config.buildings_count:null;
            this.parcelEntrances_count = config?config.parcelEntrances_count:null;
            this.existingFeatureProperties = null;
        };


        this.updateToastTitle = function (additionalInfo) {
            $rootScope.listenerObject.currentTitle = 'ნაკვეთის ხაზვა  ' + additionalInfo;
        };



        var f = function (par, par1) {
            me.back(par, par1);
        };

        var fedit = function (par, par1) {
            me.backFromEdit(par, par1);
        };



        this.layerRefresh = function () {

            $rootScope.layerOrg.refreshLayers(['parcels']);
            me.featureSelector.disable();
            $rootScope.map.defaultMode();
        }



        this.RefreshOtherDependingLayers = function () {
            $rootScope.layerOrg.refreshLayers(['parcels','buildings', 'parcelEntrances', 'buildingEntrances']);
            me.featureSelector.disable();
            $rootScope.map.defaultMode();
        };


        this.back = function (geometry, rawFeature) {
            if(utils.testArgs(arguments)){
                me.turnOn();
                me.featureSelector.disable();
                $rootScope.map.defaultMode();
                return;
            }
            me.rawFeature = rawFeature;
            me.parcel_id = geometry.ID;
            me.turnOn();
            me.layerRefresh();
            me.updateToastTitle('1/1');
            FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:me.parcel_id}, null, formCallBack, me.existingFeatureProperties);


        };

        this.backFromEdit  = function (geometry, rawFeature) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }
            me.rawFeature = rawFeature;
            me.turnOn();
            me.layerRefresh();


        }

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

            if(!me.parcel_id){
                MessagingService.displayError("შეგიძლიათ დახაზოთ 1 ნაკვეთი");
                return;
            }

            if(!me.parcelEntrances_count || me.parcelEntrances_count==0){
                MessagingService.displayError("ფორმა არ არის შევსებული");
                return;
            }

            simpleObjectService.getObjectCount('buildings',{'PARCEL_ID':me.parcel_id, 'x':me.parcel_id,}).then(function (response) {
                setIsactive(false);
                me.subscriber.trigger({who:"parcelController", parcel_id:me.parcel_id, buildings_count: me.buildings_count, parcelEntrances_count:me.parcelEntrances_count, parcelFeature:me.rawFeature, addedBuildingsCount:response.data});
            },function () {

            })




        };
        this.stop = function () {
            me.layerRefresh();
            setIsactive(false);
            this.subscriber.trigger("stop");
        };


        this.getObjectCount = function () {

            return $rootScope.layerOrg.getObjectCount('parcels',{'ID':me.parcel_id,'PARCEL_ID':me.parcel_id, 'x':me.parcel_id,});
        };

        this.draw = function () {
            if(me.getObjectCount()>=1){
                MessagingService.displayError("თქვენ შეგიძლიათ მხოლოდ ერთი ნაკვეთი დახაზოთ!");
                return;
            }
            setIsactive(false);
            DrawingControllerService.init(this.name);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);

        };



        this.selectGeometry = function(){
            me.featureSelector.enable(true);
        };

        this.cancelSelection = function(){
            me.featureSelector.disable();
        };

        this.copyGeometry = function () {

            if(!me.featureSelector.getSelectedFeatures()[0]){
                return;
            }

            if(me.featureSelector.getSelectedFeatures().length>1){
                me.split();
                MessagingService.displayError('საჭიროა მხოლოდ ერთი ობიექტის მონიშვნა');
                return;
            }

            var feature = me.featureSelector.getSelectedFeatures()[0].clone();

            var isCopied = $rootScope.layerOrg.checkIfCopied(feature.getProperties()['ID']);

            if(isCopied){
                MessagingService.displayError('მონიშნული ნაკვეთი უკვე კოპირებულია');
                return;
            }
            me.existingFeatureProperties = $rootScope.layerOrg.getFeatureProperties('existingParcels', feature.getProperties()['ID'], feature);

            var assignmentFeature = $rootScope.layerOrg.getAssignmentFeature("assignments")
            assignmentFeature = assignmentFeature.length?assignmentFeature[0]:assignmentFeature;

            if(assignmentFeature){
                if(parseInt(me.existingFeatureProperties.BLOCK_ID)!==parseInt(assignmentFeature.getProperties().BLOCK_ID)){
                    MessagingService.displayError('მონიშნული ნაკვეთი ეკუთვნის სხვა დავალებას');
                    return;
                }
            }


            setIsactive(false);
            DrawingControllerService.initEdit(this.name, feature, null, false );
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);
        }

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



            var feature = me.featureSelector.getSelectedFeatures()[0];
            if(!feature || !(feature.getProperties().name=="parcels" || feature.getProperties().featureType=="parcel")){
                MessagingService.displayError('საჭიროა ნაკვეთის მონიშვნა ნაკვეთების ფენიდან');
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
            
            setIsactive(false);
            DrawingControllerService.initEdit(this.name, feature,null, true);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,fedit);
        };
        
        
        this.deleteObject = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('წაშლა')
                .textContent('გნებავთ ობიექტის წაშლა?.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('წაშლა!')
                .cancel('გაუქმება');
            var id = me.featureSelector.getSelectedFeatures()[0].getProperties()["ID"];


            $mdDialog.show(confirm).then(function() {
                ParcelService.delete_parcel(id).then(function (response) {
                    me.parcel_id = null;
                    me.RefreshOtherDependingLayers();
                    me.updateToastTitle('0/1');
                    MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
                });

            }, function() {

            });


        }

        this.editMetadata = function () {
            
            var id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            ParcelService.getMetadata(this.infoName,id).then(function (response) {
                response.data.id = id;
                FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:null}, response.data, formCallBack);
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
        };



    };


    parcelControllerService.$inject = ["$rootScope","DrawingControllerService","$mdDialog","ParcelService","FormService", "MessagingService","simpleObjectService"];
    angular.module("datacollection.services").service("parcelControllerService", parcelControllerService);


})();


