(function () {
    var buildingControllerService = function ($rootScope, buildingEntranceControllerService,DrawingControllerService,$mdDialog, ParcelService,FormService,MessagingService,simpleObjectService) {
        var isactive = false;
        var nextButton = false;
        var me  = this;


        var fedit = function (par,par1) {
            me.backFromEdit(par, par1);
        };

        function setNextButton(status) {
            nextButton = status;
        }

        function selectFilter(feature, layer) {
            return (layer.get('name')=='buildings' && feature.get('PARCEL_ID')== me.parcel_id) || !me.parcel_id && layer.get('name')=='existingBuildings';
        }


        function formCallBack(parameters) {
            if(!parameters){
                return;
            }
            parameters.id = me.building_id;
            me.buildingEntrances_count = parameters.BUILDING_ENTRANCES_NUM;

            if(parseInt(me.buildingEntrances_count)!==0){
                var callback = function () {
                    me.subStep();
                }
                me.layerRefresh(callback);
                return;
            }

            me.layerRefresh(null);
        }


        var f = function (par, par1) {
            me.back(par, par1);
        };

        var backFromChild = function (par) {
            me.backFromChild();
        };

        var backFromChildEnding = function (par) {
            me.backFromChildEnding();
        };



        function setIsactive(act){
            isactive = act;
            if(act){
                //me.featureSelector = new WFSFeatureSelector($rootScope.map.map, $rootScope.map.layers, selectFilter);
                me.featureSelector = featureSelectorFactory($rootScope.map.map, $rootScope.map.layers,$rootScope.layerOrg.selectFilter({layers:['buildings', 'existingObjects','all', 'existingBuildings'],layerName:'buildings', key:'PARCEL_ID', value:me.parcel_id}) );
                me.updateToastTitle( me.getObjectCount() + "/" + me.allowed_count);
            }else{
                if(me.featureSelector){
                    me.featureSelector.disable();
                    $rootScope.map.map.removeInteraction(me.featureSelector.selectInteraction);
                    me.featureSelector = null;
                }

            }
        }



        function getStatus(){
            return isactive;
        }

        this.getNextButtonStatus = function () {
            return nextButton;
        };
        this.init = function (config) {
            this.map = config.map;
            this.parcel_id = config.parcel_id;
            this.allowed_count = config.allowed_count;
            this.subscriber = new Action();
            this.name = 'buildingGeometry';
            this.infoName = 'buildingInfo';
            this.buildingEntrances_count = null;
            this.existingFeatureProperties = null;

        };

        this.turnOn = function () {
            setIsactive(true);
            setNextButton(false);
        };

        this.getStatus = function () {
            return getStatus();
        };


        this.addCallback = function (args, func) {
            this.subscriber.addCallback(args, func);
        };


        this.next = function () {

            simpleObjectService.getObjectCount('buildings',{'x':me.parcel_id,'PARCEL_ID':me.parcel_id}).then(function (response) {
                if(response.data < me.allowed_count){
                    MessagingService.displayError("შენობების რაოდენობა ნაკლებია მითითებულზე");
                    return;
                }

                if(!me.buildingEntrances_count){
                    simpleObjectService.getFeatures('buildings', me.parcel_id).then(function (response) {
                        var buildingfeatures = [];
                        response.data.features.map(function (x) {

                            let geoJ = new ol.format.GeoJSON({featureProjection: 'EPSG:3857'});
                            let f = geoJ.readFeatures(x)[0];
                            buildingfeatures.push(f);
                            //buildingfeatures.push((new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(x.feature)[0])
                            return x;
                        });

                        if(buildingfeatures && buildingfeatures.filter(x=>!(x.getProperties().IS_COMPLETE)).length>0){
                            MessagingService.displayError("ფორმა არ არის შევსებული");
                            return;
                        }



                    },function () {

                    })
                }

                me.layerRefresh(null, ["parcels", "parcelEntrances","buildings", "buildingEntrances"]);

                setIsactive(false);
                me.subscriber.trigger({who:"buildingController"});

            },function () {

            });


            //////////////////////////////////////////////////
            /*if(me.getObjectCount() < me.allowed_count){
                MessagingService.displayError("შენობების რაოდენობა ნაკლებია მითითებულზე");
                return;
            }

            if(!me.buildingEntrances_count){

                var buildingfeatures = $rootScope.layerOrg.getFeaturesByCriteria('buildings',{'x':me.parcel_id,'PARCEL_ID':me.parcel_id});

                if(buildingfeatures && buildingfeatures.filter(x=>!(x.getProperties().IS_COMPLETE)).length>0){
                    MessagingService.displayError("ფორმა არ არის შევსებული");
                    return;
                }
            }



            me.layerRefresh(null, ["parcels", "parcelEntrances","buildings", "buildingEntrances"]);

            setIsactive(false);
            this.subscriber.trigger({who:"buildingController"});*/
        };

        this.backFromChild = function () {
            setIsactive(true);
            setNextButton(true);
        };

        this.backFromChildEnding = function () {
            //aq unda davasrulo, aqedan unda gamovides
            this.next();
        }

        this.layerRefresh  = function(myCallBack, layers){

            $rootScope.layerOrg.refreshLayers(layers || ['buildings'] , myCallBack);
            if(me.featureSelector){
                me.featureSelector.disable();
            }

            $rootScope.map.defaultMode();
        };

        this.updateToastTitle = function (additionalInfo) {
            $rootScope.listenerObject.currentTitle = 'შენობების ხაზვა  ' + additionalInfo;
        };

        this.back = function (geometry, rawFeature) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }
            me.rawFeature = rawFeature;
            geometry.id = me.parcel_id;
            var actualCount = me.getObjectCount();
            me.turnOn();
            me.layerRefresh();
            me.building_id = geometry.ID;
            me.updateToastTitle(actualCount+'/' + me.allowed_count);

            FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:me.building_id}, null, formCallBack,  me.existingFeatureProperties);
        };

        this.backFromEdit  = function (geometry, rawFeature) {
            if(utils.testArgs(arguments)){
                setIsactive(true);
                return;
            }
            me.rawFeature = rawFeature;
            me.turnOn();
            me.layerRefresh();
        };

        this.stop = function () {
            this.layerRefresh(null, ['parcels', 'buildings', 'parcelEntrances', 'buildingEntrances']);
            setIsactive(false);
            this.subscriber.trigger("stop");
        };


        this.getObjectCount = function () {

            return $rootScope.layerOrg.getObjectCount('buildings',{'x':me.parcel_id,'PARCEL_ID':me.parcel_id});
        };

        this.draw = function () {


            if(me.allowed_count <=  me.getObjectCount()){
                MessagingService.displayError("შენობების ოდენობა ემთხვევა მითითებულს, მეტის დამატების უფლება არ გაქვთ");
                return;
            }
            setIsactive(false);

            if(!this.featureToSnap){
                this.featureToSnap = $rootScope.layerOrg.search("parcels", me.parcel_id);
            }
            DrawingControllerService.init(this.name, this.featureToSnap, me.parcel_id);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,f);
        };
        
        this.subStep = function () {

            var isLast = me.getObjectCount() == me.allowed_count;
            setIsactive(false);
            buildingEntranceControllerService.init({building_id:me.building_id,map:me.map, allowed_count:me.buildingEntrances_count, isLast:isLast, featureToSnap:me.rawFeature});
            buildingEntranceControllerService.turnOn();
            if(!isLast){
                buildingEntranceControllerService.subscriber.addCallback(buildingEntranceControllerService, backFromChild);
            }else{
                buildingEntranceControllerService.subscriber.addCallback(buildingEntranceControllerService, backFromChildEnding);
            }

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


            me.existingFeatureProperties = $rootScope.layerOrg.getFeatureProperties('existingBuildings', feature.getProperties()['ID'], feature);

            var assignmentFeature = $rootScope.layerOrg.getAssignmentFeature("assignments");
            assignmentFeature = assignmentFeature.length?assignmentFeature[0]:assignmentFeature;
            if(assignmentFeature){
                if(parseInt(me.existingFeatureProperties.BLOCK_ID)!==parseInt(assignmentFeature.getProperties().BLOCK_ID)){
                    MessagingService.displayError('მონიშნული შენობა ეკუთვნის სხვა დავალებას');
                    return;
                }
            }

            setIsactive(false);
            DrawingControllerService.initEdit(this.name, feature, null, false, me.parcel_id);
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
			
			
            if(!feature || !(feature.getProperties().name=="buildings" || feature.getProperties().featureType=="building")){
                MessagingService.displayError('საჭიროა შენობის მონიშვნა შენობის ფენიდან');
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

            if(!this.featureToSnap){
                this.featureToSnap = $rootScope.layerOrg.search("parcels", me.parcel_id);
            }
            DrawingControllerService.initEdit(this.name, feature, this.featureToSnap, true);
            DrawingControllerService.turnOn();
            DrawingControllerService.subscriber.addCallback(DrawingControllerService,fedit);
        };

        this.RefreshOtherDependingLayers = function () {
            var layers = $rootScope.map.map.getLayers().getArray().filter(function (a) {
                return ['buildings', 'buildingEntrances'].indexOf(a.get('name'))>=0
            });


            layers.map(function (layer) {
                (layer.getSource()).clear(true);
                (layer.getSource()).refresh(true)
            })
            me.featureSelector.disable();
            $rootScope.map.defaultMode();
        };

        this.deleteObject = function (ev) {


            var feature  = me.featureSelector.getSelectedFeatures()[0];

            if(!feature || feature.getProperties().featureType!=="building"){
                MessagingService.displayError('საჭიროა შენობის მონიშვნა შენობის ფენიდან');
                return;
            }

            var confirm = $mdDialog.confirm()
                .title('წაშლა')
                .textContent('გნებავთ ობიექტის წაშლა?.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('წაშლა!')
                .cancel('გაუქმება');


            var id = me.featureSelector.getSelectedFeatures()[0].getProperties()['ID'];
            var actualCount = me.getObjectCount();

            $mdDialog.show(confirm).then(function() {
                ParcelService.delete_building(id).then(function (response) {
                    me.RefreshOtherDependingLayers();
                    actualCount--;
                    me.updateToastTitle(actualCount+'/' + me.allowed_count );
                    MessagingService.displaySuccess('ობიქტი წარმატებით წაიშალა');
                });

            }, function() {

            });

        }


        this.editMetadata = function () {

            


            var id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            me.building_id = id;

            ParcelService.getMetadata(this.infoName,id).then(function (response) {

                FormService.allowDataEntrance(me.title, {stepName:me.infoName, id:me.building_id}, response.data, formCallBack);
            });

        }


        this.editEntrances = function () {

            if(me.featureSelector.getSelectedFeatures().length>1){
                me.split();
                MessagingService.displayError('საჭიროა მხოლოდ ერთი ობიექტის მონიშვნა');
                return;
            }


            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }



            var feature = me.featureSelector.getSelectedFeatures()[0];
            me.building_id = feature.get('ID');




            var callback = function (data) {
                me.buildingEntrances_count = data.geometry?feature.get('BUILDING_ENTRANCES_NUM'):data.BUILDING_ENTRANCES_NUM;

                if(me.buildingEntrances_count==0){
                    MessagingService.displayError('საჭიროა ამ შენობის ფორმის ველების შევსება');
                    return;
                }


                setIsactive(false);
                buildingEntranceControllerService.init({building_id:me.building_id, map:me.map, allowed_count:me.buildingEntrances_count});
                buildingEntranceControllerService.turnOn();
                buildingEntranceControllerService.subscriber.addCallback(buildingEntranceControllerService,backFromChild);
            }

            var data = $rootScope.layerOrg.getFeatureProperties('buildings', me.building_id, callback);

            me.buildingEntrances_count = data.N?feature.get('BUILDING_ENTRANCES_NUM'):data.BUILDING_ENTRANCES_NUM;

            if(parseInt(me.buildingEntrances_count)==0){
                MessagingService.displayError('შენობას არ აქვს შესასვლელები');
                return;
            }



            buildingEntranceControllerService.init({building_id:me.building_id, map:me.map, allowed_count:me.buildingEntrances_count, featureToSnap:feature});
            setIsactive(false);
            buildingEntranceControllerService.turnOn();
            buildingEntranceControllerService.subscriber.addCallback(buildingEntranceControllerService,backFromChild);





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


    buildingControllerService.$inject = ["$rootScope", "buildingEntranceControllerService","DrawingControllerService","$mdDialog", "ParcelService","FormService","MessagingService","simpleObjectService"];
    angular.module("datacollection.services").service("buildingControllerService", buildingControllerService);


})();
