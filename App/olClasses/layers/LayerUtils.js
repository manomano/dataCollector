
var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();



var layerOrganizer = (function () {
    function layerOrganizer() {
    }

    layerOrganizer.prototype.checkIfCopied = function (existingId) {
        var ongoingAssignmentId = utils.getAuthorization().ongoingAssignmentId;
        var result = {};


        $.ajax({
            url: utils.apiURL + 'assignments/checkIfCopied',
            data:{'assignmentId':ongoingAssignmentId,'existingParcelId':existingId },
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            async: false,
            success:function (data) {
                result.data = data;
            }
        });

        return result.data;

    };

    layerOrganizer.prototype.setExtentOnOngoingAssignment = function () {
        var theRole = utils.getAuthorization().role;
        if(theRole=='ROLE_TRAFFIC_OPERATOR'){
            return this.getAssignmentFeature('roadAssignments');
        }else{
            return this.getAssignmentFeature('assignments');
        }
    }

    layerOrganizer.prototype.getAssignmentFeature = function (layerName) {

        var result = {};

        var dict = {
            'roadAssignments':'ongoingAssignments',
            'assignments':'ongoingAssignment'
        }

        $.ajax({
            url: utils.apiURL + layerName + '/'+dict[layerName],
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            async: false,
            success:function (data) {
                result.data = data;
            }
        });

        var feature = result.data;

        if(!result.data){
            return null;
        }

        return (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(feature);
    };




    return layerOrganizer;
}());




var layerOrganizerWFS = (function (_super) {
    __extends(layerOrganizerWFS, _super);
    
    
    function layerOrganizerWFS(layers) {
        var _this = _super.call(this) || this;
        _this.layers = layers.filter(x => x.type == 'VECTOR');
        _this.map = map;
        _this.urls = {
            assignments:utils.apiURL+'assignments/x',
            roadAssignments:utils.apiURL+'roadAssignments/x',
        };
        return _this;
    }




    layerOrganizerWFS.prototype.refreshLayers = function (layerNames, myCallBack) {
        var layers = this.layers.filter(function (a) {
            return layerNames.indexOf(a.get('name'))>=0
        });

        layers.map(function (layer) {
            (layer.getSource()).clear(true);
            (layer.getSource()).refresh(true)
        });

        if(typeof (myCallBack)=='function'){
            myCallBack();
        }
    }


    layerOrganizerWFS.prototype.getFeatureProperties = function (layerName, id, feature) {

        if(feature){
            return feature.getProperties();
        }


        var layers = this.layers.filter(function (p1, p2, p3) {
            return p1.get('name')==layerName
         });

         var feature = layers[0].getSource().getFeatures().filter(function (p1, p2, p3) {
            return p1.get('ID') ==id;
         })[0];

        //callback(feature);
        return feature;

    };


    layerOrganizerWFS.prototype.getFeaturesByCriteria = function (layerName, params) {
        var layers = this.layers.filter(function(layer){
            return layer.get('name') == layerName
        });


        var vectorSource = layers[0].getSource();
        var features = vectorSource.getFeatures();

        var newArr = [];
        var controllingArr = [];

        var parametersQ = Object.keys(params).length;

        for(var i = 0; i<features.length; i++){

            let counter = 0;

            for (var key in params) {

                if(params[key] && features[i].N[key]==params[key]){
                    counter++;
                }
            }
            if(counter==parametersQ -1 && controllingArr.indexOf(features[i].N.ID) < 0){
                controllingArr.push(features[i].N.ID);
                newArr.push(features[i]);
                //break;
            }
        }

        return newArr;
    };



    layerOrganizerWFS.prototype.getObjectCount = function (layerName, params) {

       var newArr = this.getFeaturesByCriteria(layerName, params);

        return newArr.length;
    };


    layerOrganizerWFS.prototype.metadataIsFilled = function (layerName, id) {


        var layers = this.layers.filter(function (p1, p2, p3) {
            return p1.get('name')==layerName
        });


        var feature = layers[0].getSource().getFeatures().filter(function (p1, p2, p3) {
            return p1.get('ID') ==id;
        })[0];

        if(!feature){
            return false;
        }
        return feature.get('METADATA_IS_FILLED')

    }



    layerOrganizerWFS.prototype.selectFilter = function (params) {
        return function selectFilter(feature, layer) {
            return (layer.get('name')==params.layerName && feature.get(params.key)== params.value)  || (layer.get('name').toLocaleLowerCase()=='existing'+params.layerName);
        }
    }



    layerOrganizerWFS.prototype.search = function (layerName, id) {

        var layer;
        for(var i=0;i<this.layers.length; i++){
            if(this.layers[i].get('name')==layerName){
                layer = this.layers[i];
                break;
            }
        }


        if(layer){
            var feature = layer.getSource().getFeatures().find(function (x) {
                return layerName.toLowerCase().indexOf('assignments')>=0? x.get('BLOCK_ID')== id:x.get('ID')== id
            });

            return feature;
        }

        return null;
    }

    return layerOrganizerWFS;
})(layerOrganizer);



var layerOrganizerWMS = (function (_super) {
    __extends(layerOrganizerWMS, _super);
    function layerOrganizerWMS(map, layers) {
        var _this = _super.call(this) || this;
        _this.layers = layers.filter(x => x.type == 'TILE');
        _this.map = map;
        var admin = utils.getRole()=='ROLE_ADMIN'?'admin/':'';
        _this.admin = admin;
        _this.urls = {
            parcels:utils.apiURL+admin+'pebe/parcels/x/metadata',
            parcelEntrances:utils.apiURL+admin+'pebe/parcelEntrances/x/metadata',
            buildings:utils.apiURL+admin+'pebe/buildings/x/metadata',
            buildingEntrances:utils.apiURL+admin+'pebe/buildingEntrances/x/metadata',

            existingParcels:utils.apiURL+admin+'pebe/existingParcels/x/metadata',
            existingBuildings:utils.apiURL+admin+'pebe/existingBuildings/x/metadata',

            pois: utils.apiURL+admin+'pois/x/metadata',
            trafficSigns:utils.apiURL+admin+'trafficSigns/x/metadata',
            busStops:utils.apiURL+admin+'busStops/x/metadata',


            assignments:utils.apiURL+admin+'assignments/x',
            roadAssignments:utils.apiURL+admin+'roadAssignments/x',

            parcelEntrancesNum:    admin+'pebe/parcels/x/parcelEntrancesNum',
            buildingEntrancesNum:admin+'pebe/buildings/x/buildingEntrancesNum',
            buildingsNum: admin+'pebe/parcels/x/buildingsNum',

            parcelsMetadataIsFilled:admin+'pebe/parcels/x/metadataIsFilled',
            buildingsMetadataIsFilled:admin+'pebe/buildings/x/metadataIsFilled'
        };
        return _this;
    }


    layerOrganizerWMS.prototype.refreshLayers = function (layerName, myCallBack) {

        if(typeof (myCallBack)=='function'){
            myCallBack();
        }

        return;

        var view = this.map.map.getView();
        var curResolution = view.getResolution();
        this.map.map.getView().setResolution(curResolution + 4);
        this.map.map.renderSync();


        //this.map.map.getView().setResolution(curResolution)
        //***zoomINOut
       /* var view = this.map.map.getView();
        var currentZoom = view.getZoom();

        var currentRotation = view.getRotation();

        view.setZoom(currentZoom +1);
        setTimeout(function(){
            view.setZoom(currentZoom);
            }, 2000);*/
        ///***zoomINOut

        //ol.tileGrid.clear();
        var layers = this.layers.filter(function (a) {
            return layerName.indexOf(a.get('name'))>=0 || a.get('name').indexOf("all") >=0
        });

        layers.map(function (layer) {
            var source = layer.getSource();

            source.changed();




            if(typeof(layer.refresh)=='function') {
                layer.refresh();
            }


            if(typeof(source.refresh)=='function') {
                source.refresh();
            }



           /* var params = source.getProperties();
            params.t = new Date().getMilliseconds();
            source.setProperties(params);


            source.dispatchEvent('change');*/
            /*source.tileCache.expireCache({});
            source.tileCache.clear();*/
            //source.refresh();
            //source.setParams({});
            //setTileUrlFunction
            source.setTileUrlFunction(source.getTileUrlFunction());
        });
        $(window).trigger('resize');
        this.map.map.changed();
        this.map.map.updateSize();
        if(typeof (myCallBack)=='function'){
            myCallBack();
        }

    };

    layerOrganizerWMS.prototype.getFeatureProperties = function (layerName, id, callback) {
        var newURL = this.urls[layerName].replace("x/",id+"/");
        var result = {};
        $.ajax({
            url: newURL,
            async: false,
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            method: 'GET',
            dataType: 'json',

            success: function(data){
                result.properties = data
            },
            failure:function (response) {
                result.properties = null
            }
        });

        return result.properties;
    };


    layerOrganizerWMS.prototype.getObjectCount = function (layerName, params) {
        if(['pois', 'trafficSigns', 'busStops'].indexOf(layerName)>=0){
            if(!params.x){
                return 0;
            }


            //var response =  this.getFeatureProperties(layerName, params.x)
            //if(response){
                return 1;
            //}
        }

        if(layerName=='parcels' && params.ID){
            return 1;
        }

        if(!params.ID){
            var errorCounter = 0;
            for(var prop in params){
                if(!params[prop]){
                    errorCounter++;
                }
            }

            if(errorCounter>0){
                return 0;
            }
        }
        var newURL = utils.apiURL + this.urls[layerName + 'Num'].replace('x/',params.x+"/");
        var result = {};
        $.ajax({
            url: newURL,
            async: false,
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            success:function (data) {
                result.count = data;
            }
        });

        return result.count;

    };

    layerOrganizerWMS.prototype.metadataIsFilled  = function (layerName, id) {


        var result = {};
        $.ajax({
            url: utils.apiURL + this.urls[layerName+'MetadataIsFilled'].replace('x/',id+"/"),
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            async: false,
            success:function (data) {
                result.metadata_id_filled = data;
            }
        });

        return result.metadata_id_filled;
    }


    layerOrganizerWMS.prototype.selectFilter = function (params) {
        return params;
    }


    layerOrganizerWMS.prototype.getFeatures = function (layerName, id) {
        var admin = this.admin;
        var urls = {
            parcels:utils.apiURL+admin+'pebe/parcels/x',
            parcelEntrances:utils.apiURL+admin+'pebe/parcelEntrances/x',
            buildings:utils.apiURL+admin+'pebe/buildings/x',
            buildingEntrances:utils.apiURL+admin+'pebe/buildingEntrances/x',
            existingParcels:utils.apiURL+admin+'pebe/existingParcels/x',
            existingBuildings:utils.apiURL+admin+'pebe/existingBuildings/x',
            pois: utils.apiURL+admin+'pois/x',
            trafficSigns:utils.apiURL+admin+'trafficSigns/x',
            busStops:utils.apiURL+admin+'busStops/x',
            assignments:utils.apiURL+admin+'assignments/x/assignment',
            roadAssignmentsByGroupId:utils.apiURL+admin+'roadAssignments/groupId/x',
            roadAssignmentsByObjectId:utils.apiURL+admin+'roadAssignments/x/roadAssignments'
        };

        var result = {};
        $.ajax({
            url: urls[layerName].replace('/x',"/"+id),
            headers: {
                'Authorization':userToken.getUserToken(),
                'Content-Type': 'application/json'
            },
            async: false,
            success:function (data) {
                result.data = data;
            }
        });

        return result.data
    }


    layerOrganizerWMS.prototype.search = function (layerName, id) {


        var result  = this.getFeatures(layerName, id);

        var feature = layerName=='parcels'?result.feature:result;


        if(!result.data && !result.geometry && !feature){
            return null;
        }

        if(!feature.features){
            if(!feature.properties){
                feature.properties = {};
            }
            feature.properties.featureType = layerName.substring(0,layerName.length-1);
        }else{

            var n = (layerName.split("By")[0]);
            n = n.substring(0,n.length-1);
            feature.features.map(x=>x.properties.featureType = n);
            return (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(feature);
        }

        return (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(feature)[0];

    }



    layerOrganizerWMS.prototype.getFeaturesByCriteria = function (layerName, o) {



        var result = this.getFeatures("parcels", o.x);
        var features = [];
        result.buildings.map(function (x) {
            features.push((new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(x.feature)[0])
          return x;
        });
        return features;

    };
   

    return layerOrganizerWMS;

})(layerOrganizer);








var LayerUtils = (function () {
    function LayerUtils() {
    }
    LayerUtils.generateVectorLayerFromURL = function (url, LayerName) {
        var l_utils = this;
        var vectorLayerSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            loader: function(extent, resolution, projection) {
                var me  = this;
                var proj = projection.getCode();

                var xhr = new XMLHttpRequest();
                //xhr.withCredentials = true;
                xhr.open('GET', url);
                xhr.timeout = 30000;
                xhr.setRequestHeader("Authorization", userToken.getUserToken());
                xhr.setRequestHeader('Content-Type', 'application/json');
                var onError = function(a,b,c) {

                    //if(statusCode==401){
                        var arr = window.location.href.split('#!/');
                        window.location.href = arr[0]+'#!/'+'login';
                        location.reload();
                   // }
                    //vectorLayerSource.removeLoadedExtent(extent);
                }
                xhr.onerror = onError;


                xhr.onreadystatechange  = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var preFeatures = (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(xhr.responseText);

                        preFeatures.map(function (el) {
                            if(url.indexOf("pebe/")>=0){
                                el.set('name',url.split('pebe/')[1]);
                            }else if(url.indexOf("roadAssignments/")>=0){
                                el.set('name','roadAssignments');
                            }else if(url.indexOf("assignments/")>=0){
                                el.set('name','assignments');

                                var ongoingAssignmentId = JSON.parse(window[utils.getStorageType()].getItem("Authorization")).ongoingAssignmentId;
                                if(el.get('ID')==ongoingAssignmentId){
                                    l_utils.ongoingAssignment = el.getGeometry();
                                    //l_utils.extent = l_utils.ongoingAssignment.getExtent();
                                    l_utils.ongoingAssignmentID = ongoingAssignmentId;
                                }
                            }else if(url.indexOf("pois")>=0){
                                el.set('name','pois');
                            }else if(url.indexOf("trafficSigns")>=0){
                                el.set('name','trafficSigns');
                            }else if(url.indexOf("busStop")>=0){
                                el.set('name','busStops');
                            }else if(url.indexOf("existingParcels")>=0){
                                el.set('name','existingParcels');
                            }



                        });

                        vectorLayerSource.addFeatures(
                           // (new ol.format.GeoJSON({featureProjection: 'EPSG:3857'})).readFeatures(xhr.responseText)
                            preFeatures
                            );

                        var myCallBack = me.get('myCallBack')
                        if(myCallBack){
                            myCallBack();
                            me.set('myCallBack',null);
                        }
                    }  else if (this.readyState == 4) {

                        onError(xhr.status);
                    } else {

                    }
                }
                xhr.send();
            },
            strategy: ol.loadingstrategy.bbox

        });



        style_function = function(feature) {
            //var is_metadata_filled = feature.get('METADATA_IS_FILLED');
            var is_complete = feature.get('IS_COMPLETE');
            var factorTwo = typeof (is_complete )=='undefined'? true:is_complete;

            var layerName = feature.get('name');
            var styleName = '';
            if(layerName=='assignments' || layerName=='roadAssignments'){
                styleName = feature.get('STATUS').toLowerCase() + 'TaskStyle';

                var stylesArr = [];
                stylesArr.push(Styles[styleName]);
                if(layerName=='assignments'){
                    stylesArr.push(new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.1)' }),
                            stroke: new ol.style.Stroke({ color: 'red', width: 2 })
                        }),
                        text: Styles.createTextStyle(feature)
                    }));
                }


                return stylesArr;
            }

            styleName = layerName+'FeatureStyle';

            /*if(typeof (is_metadata_filled)=='undefined'){
                return Styles[styleName];
            }*/
            return factorTwo ?Styles[styleName]:Styles['errorStyle'];
        }

        var vectorLayer = new ol.layer.Vector({
            source: vectorLayerSource,
            renderOrder: null,
            visible: false,
            style:style_function
           /* format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:3857'
            })*/
        });
        return vectorLayer;
    };





    LayerUtils.createTileLayer = function (params, url, serverType) {

        if (url === void 0) { url = utils.geoserverBaseURL; }
        if (serverType === void 0) { serverType = 'geoserver'; }
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: url,
                params: params,
                serverType: serverType
            }),
            visible: false
        });
    };
    LayerUtils.getPlaceIdEnvVariable = function (placeID) {
        return 'placeid:' + placeID + ';';
    };
    LayerUtils.getUserIdEnvVariable = function (userID) {
        if (userID == 0)
            return "";
        return 'userid:' + userID + ';';
    };
    LayerUtils.generateNGCACHETileLayer = function (layerName, urlTemplate, visibility) {
        if (urlTemplate === void 0) { urlTemplate = NGCACHEServerInfo.NGCACHE_URL_TEMPLATE; }

        urlTemplate = urlTemplate + '&AutoKey='  + Math.random()+'&p='+utils.placeId();
        var layer  = new ol.layer.Tile({
            //preload: 0,
            opacity: 0.8,
            //defaultProjection: 'EPSG:900913',
            projection: 'EPSG:4326',
            source: new ol.source.TileImage({
                cacheSize: 20,
                tileUrlFunction: function (coordinate) {
                    if (coordinate === null)
                        return undefined;
                    var z = coordinate[0];
                    var x = coordinate[1];
                    var y = -coordinate[2] - 1;
                    return urlTemplate.replace("{x}", x.toString()).replace("{y}", y.toString()).replace("{z}", z.toString()).replace("{l}", layerName);
                }
            }),
            visible: false //utils.getUserId()==6 ?!visibility:false
        });

        layer.setProperties({t:new Date()})
        return layer;
    };
    return LayerUtils;
}());
//# sourceMappingURL=LayerUtils.js.map