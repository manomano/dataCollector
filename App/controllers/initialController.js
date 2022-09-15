(function () {
    var initialControllerService = function ($window, $rootScope, StorageService, MessagingService, $mdDialog, assignmentService,  simpleObjectService, FormService, simpleObjectControllerService) {
        var isactive = false;
        this.isActive = false;
        var me = this;
        function selectFilter(feature, layer) {
            return true;
        }

        var f = function (par) {
            me.back(par);
        };


        function setIsactive(act){
            isactive = act;
            if(act){

                //me.featureSelector = featureSelectorFactory($rootScope.map.map, $rootScope.map.layers,null );

                me.featureSelector = new featureSelectorCoord($rootScope.map.map, $rootScope.map.layers,null );
                me.featureSelector.enable();
            }else{
                me.featureSelector.disable();
                $rootScope.map.map.removeInteraction(me.featureSelector.selectInteraction);
                me.featureSelector = null;
            }
        };

        function getStatus(){
            return isactive;
        }

        this.back = function () {
            this.turnOn();
        }


        this.init = function (map) {

            this.map = map;
            this.subscriber = new Action();

        }

        this.turnOn = function () {
            this.isActive = true;
            setIsactive(true);
        }

        this.getStatus = function () {
            return getStatus();
        }


        this.beginParcel = function () {

        /*var auxiliaryLayers = ["parcels", "parcelEntrances","buildings", "buildingEntrances"];
            var visibleLayers = $rootScope.map.layers.filter(function (layer) { return layer.getVisible() &&  auxiliaryLayers.indexOf(layer.get('name'))>=0 ; }).map(function (layer) {
                return layer.get('name');
            });

            if(visibleLayers.length<4){

                //var absentLayers = auxiliaryLayers.filter(value => -1 !== visibleLayers.indexOf(value));

                MessagingService.displayError('საჭიროა ნაკვეთების/ნაკვეთის შესასვლელების/შენობების/შენობის შესასვლელების ფენების ჩართვა');

                return;
            }
        */

            setIsactive(false);
            this.subscriber.trigger({who:"initialController"});
        }

        this.createSimpleObjectsGeneral = function (config) {
            setIsactive(false);

            simpleObjectControllerService.init(config);
            simpleObjectControllerService.turnOn();

            simpleObjectControllerService.subscriber.addCallback(simpleObjectControllerService, f);
            simpleObjectControllerService.draw();
        }

        this.createPOI = function () {
            this.createSimpleObjectsGeneral({id: null, serviceName:'pois', name:'poiGeometry', infoName: 'pois'  });
        }

        this.createTrafficSign = function () {
           this.createSimpleObjectsGeneral({id: null, serviceName:'trafficSigns', name:'trafficSignGeometry', infoName: 'trafficSigns' })
        }

        this.createBusStop = function () {
            this.createSimpleObjectsGeneral({id: null, serviceName:'busStops', name:'busStopGeometry', infoName: 'busStops' });
        }


        this.edit_general = function (event) {

            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }



            function qada() {

                var selected  = me.featureSelector.getSelectedFeatures()[0];
                var name = selected.get('name') || (selected.get('featureType')+'s');
                name = name[0].charCodeAt() <=90?name.toLocaleLowerCase():name;

                if(['parcels', 'parcelEntrances','buildings','buildingEntrances'].indexOf(name)>= 0){
                    me.editParcel();
                    return;
                }


                if(['pois', 'trafficSigns','busStops'].indexOf(name)< 0){
                    MessagingService.displayError('საჭიროა POI/trafficSign/busStation/PEBE ობიექტის მონიშვნა');
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
                    setIsactive(false);
                    simpleObjectControllerService.init({id: selected.get('ID'),infoName: name, editing:true,serviceName:name, name: name.substring(0,name.length-1)+'Geometry'  });
                    simpleObjectControllerService.turnOn();
                    simpleObjectControllerService.subscriber.addCallback(simpleObjectControllerService, f);

                    if(option=='geometry'){
                        simpleObjectControllerService.editGeometry(selected);
                    }else if(option=='metadata'){
                        simpleObjectControllerService.editMetadata(selected);
                    }else{
                        simpleObjectControllerService.deleteObject(selected, event);
                    }
                },function () {

                });

            }

            me.split(qada);






        }



        this.editParcel = function () {

            /*var auxiliaryLayers = ["parcels", "parcelEntrances","buildings", "buildingEntrances"];
            var visibleLayers = $rootScope.map.layers.filter(function (layer) { return layer.getVisible() &&  auxiliaryLayers.indexOf(layer.get('name'))>=0 ; }).map(function (layer) {
                return layer.get('name');
            });

            if(visibleLayers.length<4){

                var absentLayers = auxiliaryLayers.filter(value => -1 !== visibleLayers.indexOf(value));

                MessagingService.displayError('საჭიროა ნაკვეთების/ნაკვეთის შესასვლელების/შენობების/შენობის შესასვლელების ფენების ჩართვა');

                return;
            }*/



            var selected  = me.featureSelector.getSelectedFeatures()[0];
            var result_object = {};

            var properties = selected.getProperties();


            result_object.parcel_id = properties.PARCEL_ID ||  properties.ID;
            result_object.parcelEntrances_count = properties.PARCEL_ENTRANCES_NUM;
            result_object.buildings_count = properties.BUILDINGS_NUM;


            var callback = function (data) {
                if(data.geometry){
                    result_object.parcelEntrances_count = data.get('PARCEL_ENTRANCES_NUM');
                    result_object.buildings_count = data.get('BUILDINGS_NUM');
                }else{
                    result_object.parcelEntrances_count = data.PARCEL_ENTRANCES_NUM;
                    result_object.buildings_count = data.BUILDINGS_NUM;
                }

                setIsactive(false);
                me.subscriber.trigger({who:"initialController",
                    parcel_id:result_object.parcel_id,
                    parcelEntrances_count:result_object.parcelEntrances_count,
                    buildings_count: result_object.buildings_count });
            }

            var data = $rootScope.layerOrg.getFeatureProperties('parcels',result_object.parcel_id, callback);
            if(!data){
                MessagingService.displayError('დაფიქსირდა შეცდომა, თქვენ არ გაქვთ უფლება დაარედაქტიროთ მოცემული ნაკვეთი');
                return;
            }

            if(data.a){
                result_object.parcelEntrances_count = data.get('PARCEL_ENTRANCES_NUM');
                result_object.buildings_count = data.get('BUILDINGS_NUM');
            }else{
                result_object.parcelEntrances_count = data.PARCEL_ENTRANCES_NUM;
                result_object.buildings_count = data.BUILDINGS_NUM;
            }

            setIsactive(false);
            me.subscriber.trigger({who:"initialController",
                parcel_id:result_object.parcel_id,
                parcelEntrances_count:result_object.parcelEntrances_count,
                buildings_count: result_object.buildings_count });



        }

        this.addCallback = function (args, func) {
            me.subscriber.addCallback(args, func);
        }

        this.selectGeometry = function(){
            this.cancelSelection();
            $rootScope.map.defaultMode();
            me.featureSelector.enable(true);

        }

        this.cancelSelection = function(){

            if(me.featureSelector){
                me.featureSelector.disable();
            }

        }


        this.cancelTools = function() {
            $rootScope.map.defaultMode();

            this.cancelSelection();
        }

        this.refreshLayer = function (layerName) {

            $rootScope.layerOrg.refreshLayers([layerName], myCallBack);
            if(me.featureSelector){
                me.featureSelector.disable();
            }

            $rootScope.map.defaultMode();
        }


        this.refresh = function () {
            location.reload();
        }

        this.assignTask = function () {

            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            var layerName = me.featureSelector.getSelectedFeatures()[0].get('name') || (me.featureSelector.getSelectedFeatures()[0].get('featureType') +'s');
            if(['assignments', 'roadAssignments'].indexOf(layerName)<0){
                MessagingService.displayError('საჭიროა დავალების მონიშვნა');
                return;
            }


            var user_id = me.featureSelector.getSelectedFeatures()[0].get('USER_ID');



            if(layerName=='roadAssignments'){
                var assignment_ids = [];
                me.featureSelector.getSelectedFeatures().map(function (el) {
                    assignment_ids.push(el.get('ID'));
                });

            }else{
                var assignment_ids = me.featureSelector.getSelectedFeatures()[0].get('ID');
            }




            $mdDialog.show(
                {
                    title: '',
                    width: 500,
                    controller: 'assignmentFormCtrl',
                    templateUrl: prefix + 'App/views/assignmentForm.html',
                    locals: {
                        user_id:        user_id,
                        assignment_ids:  assignment_ids,
                        serviceName:layerName
                    },
                    targetEvent: event,
                    clickOutsideToClose: false
                }
            ).then(function () {
                me.refreshLayer(layerName);
            },function () {
               console.log('cancel')
            });
        }



        this.taskErrors = function () {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            var layerName = me.featureSelector.getSelectedFeatures()[0].get('name')  || (me.featureSelector.getSelectedFeatures()[0].get('featureType')+'s');
            if(['assignments', 'roadAssignments'].indexOf(layerName)<0){
                MessagingService.displayError('საჭიროა დავალების მონიშვნა');
                return;
            }



            var user_id = me.featureSelector.getSelectedFeatures()[0].get('USER_ID');
            var assignment_id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            $mdDialog.show(
                {
                    title: '',
                    width: 500,
                    controller: 'assignmentErrorsCtrl',
                    templateUrl: prefix + 'App/views/assignmentErrors.html',
                    locals: {
                        user_id:        user_id,
                        assignment_id:  assignment_id,
                        serviceName:layerName
                    },
                    targetEvent: event,
                    clickOutsideToClose: false
                }
            ).then(function () {
                me.refreshLayer(layerName);
            },function () {
                console.log('cancel')
            });
        }

        this.completeTask = function () {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            var layerName = me.featureSelector.getSelectedFeatures()[0].get('name')  || (me.featureSelector.getSelectedFeatures()[0].get('featureType')+'s');
            if(['assignments', 'roadAssignments'].indexOf(layerName)<0){
                MessagingService.displayError('საჭიროა დავალების მონიშვნა');
                return;
            }

            var user_id = me.featureSelector.getSelectedFeatures()[0].get('USER_ID');
            var assignment_id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            assignmentService.completeTask(layerName, assignment_id).then(function () {
                MessagingService.displaySuccess("დავალება დასრულებულია!");
                me.taskInfoRefresh();
            }, function (response) {
                var txt = response.status==403?'დავალების დასრულება შეუძლებელია, რადგან დაუსრულებელ ობიექტებს შეიცავს':'გაურკვეველი პრობლემაა!';
                MessagingService.displayError(txt);



            });

        }


        this.taskInfoRefresh = function () {
            var auth = StorageService.getObject('Authorization');
            auth.ongoingAssignmentId = -1;
            StorageService.setvalue('Authorization',JSON.stringify(auth));
            $window.location.reload();
        }

        this.getInfo = function () {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            function getMyInfo() {



                var feature = me.featureSelector.getSelectedFeatures()[0];

                var layerName = feature.get('name') || (feature.getProperties().featureType + 's');
                layerName = layerName[0].charCodeAt() <=90?layerName.toLocaleLowerCase():layerName;


                var id = feature.get('ID');
                var additional = ['parcels', 'buildings', 'parcelEntrances', 'buildingEntrances', 'existingParcels','existingBuildings'].indexOf(layerName)>=0?'pebe/':'';

                simpleObjectService.getInfo(id,layerName,additional).then(function (response) {

                    if(additional){
                        var arr = ['BUILDINGS_NUM', 'PARCEL_ENTRANCES_NUM', 'BUILDING_ENTRANCES_NUM'];
                        var actualChildElementsNum = {BUILDINGS_NUM:null, PARCEL_ENTRANCES_NUM:null, BUILDING_ENTRANCES_NUM:null};
                        arr.map(function (x) {

                            if(response.data[x]){
                                actualChildElementsNum[x] = response.data['CURRENT_'+x] ;
                            }
                            return x;
                        });
                    }


                    FormService.showData(layerName + 'info', layerName, response.data, actualChildElementsNum, {id:id});
                });

            }


                me.split(getMyInfo);

        }


        this.getErrors = function () {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            function f() {

                var feature = me.featureSelector.getSelectedFeatures()[0];

                var layerName = feature.get('name') || (feature.getProperties().featureType + 's');
                layerName = layerName[0].charCodeAt() <=90?layerName.toLocaleLowerCase():layerName;


                var id = feature.get('ID');
                var additional = ['parcels', 'buildings', 'parcelEntrances', 'buildingEntrances', 'existingParcels','existingBuildings'].indexOf(layerName)>=0?'pebe/':'';
                if(['parcels', 'buildlings'].indexOf(layerName)<0){
                    MessagingService.displayError('საჭიროა შენობის ან ნაკვეთის მონიშვნა');
                    return;
                }

                simpleObjectService.getError(id,layerName,additional).then(function (response) {

                    if(additional){
                        var arr = ['BUILDINGS_NUM', 'PARCEL_ENTRANCES_NUM', 'BUILDING_ENTRANCES_NUM'];
                        var actualChildElementsNum = {BUILDINGS_NUM:null, PARCEL_ENTRANCES_NUM:null, BUILDING_ENTRANCES_NUM:null};
                        arr.map(function (x) {

                            if(response.data[x]){
                                actualChildElementsNum[x] = response.data['CURRENT_'+x] ;
                            }
                            return x;
                        });
                    }


                    FormService.showData(layerName + 'info', layerName, response.data, actualChildElementsNum, {id:id});
                });

            }


            me.split(f);

        }



        this.pauseTask = function () {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            var layerName = me.featureSelector.getSelectedFeatures()[0].get('name')  || (me.featureSelector.getSelectedFeatures()[0].get('featureType')+'s');
            if(['assignments', 'roadAssignments'].indexOf(layerName)<0){
                MessagingService.displayError('საჭიროა დავალების მონიშვნა');
                return;
            }


            var user_id = me.featureSelector.getSelectedFeatures()[0].get('USER_ID');
            var assignment_id = me.featureSelector.getSelectedFeatures()[0].get('ID');

            assignmentService.pauseTask(layerName,assignment_id).then(function () {
                MessagingService.displaySuccess("დავალება დაპაუზებულია!")
                me.taskInfoRefresh();
            }, function (response) {


                MessagingService.displayError("problemaa");
            });


        }


        this.measureTool = function (measurementType) {
            $rootScope.map.startMeasuring(measurementType);
        }

        this.myLocation = function () {
            $rootScope.map.myLocation();
        }

        this.deleteExistingParcel = function (ev) {
            if(!me.featureSelector.getSelectedFeatures()[0]){
                MessagingService.displayError('საჭიროა ობიექტის მონიშვნა');
                return;
            }

            var feature = me.featureSelector.getSelectedFeatures()[0];
            var layerName = feature.get('name');
            var id = feature.get('ID');
            if(['existingParcels'].indexOf(layerName)<0){
                MessagingService.displayError('საჭიროა არსებული ნაკვეთის მონიშვნა');
                return;
            }


            var confirm = $mdDialog.confirm()
                .title('გნებავთ ობიექტის წაშლა?')
                .textContent('გნებავთ ობიექტის წაშლა?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('წაშლა!')
                .cancel('წაშლის გაუქმება');


            $mdDialog.show(confirm).then(function() {

                FormService.allowDataEntrance('არსებული ნაკვეთის მონიშვნა', 'parcelMarks', null, null).then(function (data) {
                    data.existingParcelId = id;
                    simpleObjectService.markParcelForDelete(data);
                },function () {

                });
            }, function() {

            });









        }

        this.setRotation = function () {
            $rootScope.map.map.getView().setRotation(0);
        }

        this.ZoomIn = function () {
            var currentZoom = $rootScope.map.map.getView().getZoom();
            $rootScope.map.map.getView().setZoom(currentZoom + 1)
        }


        this.ZoomOut = function () {
            var currentZoom = $rootScope.map.map.getView().getZoom();
            $rootScope.map.map.getView().setZoom(currentZoom - 1)
        }

        this.split = function (callback) {

            var features = this.featureSelector.getSelectedFeatures();
            if(features.length==1){
                callback();
                return;
            }

            MessagingService.displayError('საჭიროა მხოლოდ ერთი ობიექტის მონიშვნა');



            var FeatureArr = [];
            features.map(x=>FeatureArr.push({name:(x.get('featureType') || x.get('name')), id:  (x.get('featureType') || x.get('name')).substring(0,10)=='assignment'?x.get('BLOCK_ID'):x.get('ID')}));

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
                    return x.get('ID')==id  || x.get('BLOCK_ID')==id;
                })
                me.featureSelector.clearSelection();
                me.featureSelector.selectFeature(selected);
                if(typeof callback=='function'){
                    callback();
                }


            }, function () {

            });


        }


        this.setExtentOnOngoingAssignment =  function () {

            var features = $rootScope.layerOrg.setExtentOnOngoingAssignment();
            if(features){
                if(features.length){
                    var source = new ol.source.Vector();
                    source.addFeatures(features);
                    var extent = source.getExtent();
                }else{
                    var extent = features.getGeometry().getExtent();
                }

                $rootScope.map.map.getView().fit(extent);
            }

        };


        this.callImageUploader = function () {
            var acessToken = StorageService.getValue('dataCollection_accessToken');
            if(typeof(imageUploader)!=='undefined'){
              imageUploader.openImageUploadingStatusPanel(acessToken)
            }


        }


        this.printStatistics = function () {
            $mdDialog.show(
                {
                    title: '',
                    width: 500,
                    controller: 'StatisticsCtrl',
                    templateUrl: prefix + 'App/stats/statistics.html',
                    targetEvent: event,
                    clickOutsideToClose: false
                }
            ).then(function (option) {

            },function () {

            });
        }

    }


    initialControllerService.$inject = ["$window","$rootScope", "StorageService", "MessagingService", "$mdDialog","assignmentService", "simpleObjectService", "FormService","simpleObjectControllerService"];
    angular.module("datacollection.services").service("initialControllerService", initialControllerService);


})();
