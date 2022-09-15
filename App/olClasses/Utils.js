var connections_dict = {
    real:{
        apiURL :"https://data-collector-server.napr.gov.ge/",
        geoserverBaseURL:"https://gpv1.napr.gov.ge/wms",
        NGCACHE_URL_TEMPLATE:"http://dcc0.napr.gov.ge/NGCache/Layer/getTile?x={x}&y={y}&z={z}&l={l}",
        geoServerWorkSpaceName : "DATA_COLLECTOR",
        AUTH: "https://data-collector-server.napr.gov.ge/" + "auth/"
    },
    dev: {
        apiURL :"http://10.11.11.215:8080/",
        geoserverBaseURL:"https://gpv1.napr.gov.ge/wms",
        NGCACHE_URL_TEMPLATE:"http://10.11.11.191:8008/Layer/getTile?x={x}&y={y}&z={z}&l={l}",
        //NGCACHE_URL_TEMPLATE:"http://10.11.11.234:8008/Layer/getTile?x={x}&y={y}&z={z}&l={l}",
        geoServerWorkSpaceName : "DATA_COLLECTOR_DEVEL",
        AUTH: "http://10.11.11.215:8080/" + "auth/"
    }
}





var connections = function (key) {

    for(var props in connections_dict[key]){
        this[props] = connections_dict[key][props];
    }
};

var currentConnections= new connections('real');



var parse = ol.xml.parse;
var Utils = (function () {

    function Utils() {
        this.featureNameTypeMap = {
            "trafficSignGeometry":"LineString",
            "busStopGeometry":"Point",
            "poiGeometry": "Point",
            "SIGN": "LineString",
            "BUS_STATION": "Point",
            "VELO_TRACK": "Road",
            "PARCEL":"Polygon",
            "parcelGeometry":"Polygon",
            "parcelEntranceGeometry":"Point",
            "buildingGeometry":"Polygon",
            "buildingEntranceGeometry":"Point"
        };
        this.orthoLayersToRegions = {
            Zugdidi:'ortho2015Layer',
            Poti:'ortho2014Layer',
            Martvili:'ortho2014Layer',
            Kobuleti:'ortho2014Layer',
            Sagarejo:'ortho2014Layer'

        };

        this.apiURL = currentConnections.apiURL;
        this.geoserverBaseURL = currentConnections.geoserverBaseURL;
        this.measurementLayerSource = new ol.source.Vector();
        this.measurementLayer = new ol.layer.Vector({
            source: this.measurementLayerSource,
            style: Styles.measurementLayerStyle,
            renderOrder: null
        });
        this.userGPSVectorLayerSource = new ol.source.Vector();
        this.userGPSVectorLayer = new ol.layer.Vector({
            source: this.userGPSVectorLayerSource,
            renderOrder: null
        });

    }


    Utils.prototype.testArgs  = function (args) {

            var errorCont = 0;
            for(var i in args){
                if(typeof(args[i])=='undefined'){
                    errorCont++;
                }
            }
            if(errorCont==args.length){
                return true;
            }

            return false;

    }

    Utils.prototype.getStorageType = function () {
        if(localStorage){
            if(localStorage.getItem("Authorization")){
                return "localStorage";
            }
        }


        return "sessionStorage";
    }

    Utils.prototype.getRegion = function () {

        return JSON.parse(window[this.getStorageType()].getItem("Authorization")).placeName;
    }


    Utils.prototype.getAuthorization = function () {

        return JSON.parse(window[this.getStorageType()].getItem("Authorization"));
    }


    Utils.prototype.placeId = function () {

        return JSON.parse(window[this.getStorageType()].getItem("Authorization")).placeId;
    }

    Utils.prototype.getUserId = function () {

        return JSON.parse(window[this.getStorageType()].getItem("Authorization")).userId;
    }

    Utils.prototype.getRole = function () {
        return JSON.parse(window[this.getStorageType()].getItem("Authorization")).role;
    }

    Utils.prototype.getMapState = function () {
        return JSON.parse(window[this.getStorageType()].getItem("mapState"));
    }


    Utils.prototype.isWMS = function () {
        return JSON.parse(window[this.getStorageType()].getItem("isWMS"));
    }

    Utils.prototype.getDefaultView = function () {
        var centers = [
            [5050616.59, 5120145.93],
            [4665739.076507242, 5175487.411411758],
            [4687113.28553262, 5169127.6510677105],
            [4680606.081182464,5197407.848529335],
            [4724777.681062616,5222319.7005960215],
            [4757909.235337499, 5317325.164237247],
            [4687892.528545601, 5253040.738310996],
            [4694396.485284994, 5234997.3678319],
            [4667399.780371935, 5229569.59886474]
        ];
        var center_map = {
            22: centers[0],
            85:centers[2],
            48:centers[1],
            50:centers[1],
            86:centers[1],
            89:centers[1],
            90:centers[1],
            107:centers[3],
            108:centers[3],
            110:centers[4],
            111:centers[4],
            112:centers[5],
            113:centers[6],
            114:centers[6],
            115:centers[7],
            116:centers[7],
            117:centers[8],
            118:centers[8],
            119:centers[4]

        };


        return new ol.View({
            center: center_map[this.placeId()],
            zoom: 11,
            rotation: 0
        });
    }


    Utils.prototype.getSavedView = function (layers) {
        var resultView = null;
        if (window.location.hash !== '') {
            var hash = window.location.hash.replace('#map=', '');
            var parts = hash.split('/');
            if (parts.length === layers.length + 5) {
                var zoom = parseInt(parts[0], 10);
                var center = [
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ];
                var rotation = parseInt(parts[3]);
                for (var layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
                    layers[layerIndex].setVisible(parseInt(parts[layerIndex + 4]) == 1);
                }
                resultView = new ol.View({
                    center: center,
                    zoom: zoom,
                    rotation: rotation
                });
            }
        }

        if(this.getMapState()){
            var obj = this.getMapState();


            var center = obj.center1;
            var zoom = obj.zoom1;
            var rotation = obj.rotation1;
            if(!center || !zoom || !rotation){
                return null;
            }

            resultView = new ol.View({
                center: center,
                zoom: zoom,
                rotation: rotation
            });
        }

        return resultView;
    };


    Utils.prototype.getWorldView = function () {
         return new ol.View({
            center:  [4923981.587851614, 5145964.106162845],
            zoom: 13,
            minZoom: 3,
            maxZoom: 19
        });
    };

    Utils.prototype.getMartviliView = function () {
        return new ol.View({
            center: [4724471.779544626, 5216711.493477988],
            zoom: 13,
            minZoom: 3,
            maxZoom: 19
        });
    };


    Utils.prototype.getRustaviView = function () {
        return new ol.View({
            center: [5013770.42, 5094250.87],
            zoom: 13
        });
    };
    Utils.prototype.getBatumiView = function () {
        return new ol.View({
            center: [4631105.47, 5101048.14],
            zoom: 13
        });
    };
    Utils.prototype.getKobuletiView = function () {
        return new ol.View({
            center: [4648905.47, 5138100.3],
            zoom: 13
        });
    };
    Utils.prototype.getPotiView = function () {
        return new ol.View({
            center: [4662009.273513637, 5194945.234380146],
            zoom: 12
        });
    };
    Utils.prototype.getAnakliaView = function () {
        return new ol.View({
            center: [4635230.02, 5220961.75],
            zoom: 14
        });
    };
    Utils.prototype.getKutaisiView = function () {
        return new ol.View({
            center: [4811348.32, 5180993.77],
            zoom: 10
        });
    };
    Utils.prototype.getTbilisiView = function () {
        return new ol.View({
            center: [4995379.85, 5121865.14],
            zoom: 12
        });
    };
    Utils.prototype.getGoriView = function () {
        return new ol.View({
            center: [4912178.99, 5159871.31],
            zoom: 12
        });
    };

    Utils.prototype.getMtskhetaView = function () {
        return new ol.View({
            center: [4978148.82, 5141605.97],
            zoom: 12
        });
    };

    Utils.prototype.getKaspiView = function () {
        return new ol.View({
            center: [4948116.4, 5145606.76],
            zoom: 12
        });
    };
    Utils.prototype.getKhareliView = function () {
        return new ol.View({
            center: [4890323.93, 5161708.32],
            zoom: 12
        });
    };
    Utils.prototype.getKhashuriView = function () {
        return new ol.View({
            center: [4856544.35, 5156792.94],
            zoom: 12
        });
    };
    Utils.prototype.getAgraView = function () {
        return new ol.View({
            center: [4883174.46, 5162239.98],
            zoom: 12
        });
    };
    Utils.prototype.getSuramiView = function () {
        return new ol.View({
            center: [4851171.93, 5164280.26],
            zoom: 12
        });
    };
    Utils.prototype.getMarneuliView = function () {
        return new ol.View({
            center: [4993973.65, 5079779.05],
            zoom: 12
        });
    };
    Utils.prototype.getTetitskharoView = function () {
        return new ol.View({
            center: [4951837.62, 5094205.58],
            zoom: 14
        });
    };
    Utils.prototype.getBolnisiKazretiView = function () {
        return new ol.View({
            center: [4954322.13, 5072291.69],
            zoom: 13
        });
    };
    Utils.prototype.getDmanisiView = function () {
        return new ol.View({
            center: [4925443.88, 5062728.14],
            zoom: 13
        });
    };
    Utils.prototype.getManglisiWalkaBedianiView = function () {
        return new ol.View({
            center: [4926762.03, 5104231.74],
            zoom: 12
        });
    };
    Utils.prototype.getAxkerpiiView = function () {
        return new ol.View({
            center: [5000197.07, 5060804.23],
            zoom: 11
        });
    };
    Utils.prototype.getSagarejoView = function () {
        return new ol.View({
            center: [5050616.59, 5120145.93],
            zoom: 13
        });
    };
    Utils.prototype.getKutaisiNewView = function () {
        return new ol.View({
            center: [4754698, 5198609.81],
            zoom: 12
        });
    };


    Utils.prototype.getZestaponiView = function () {
        return new ol.View({
            center: [4797172.74, 5173855.53],
            zoom: 12
        });
    };


    Utils.prototype.getSenaki1View = function () {
        return new ol.View({
            center: [4680606.081182464,5197407.848529335],
            zoom: 12
        });
    };


    Utils.prototype.focusView = function (map, features) {
        //TODO refactor if mustn't be here
        if (features.length == 0) {
            alert("მონაცემები ვერ მოიძებნა");
            return;
        }
        var extent = ol.extent.createEmpty();
        var feature;
        var i = 0, ii = features.length;
        for (; i < ii; ++i) {
            feature = features[i];
            var geometry = feature.getGeometry();
            ol.extent.extend(extent, geometry.getExtent());
        }
        map.getView().setCenter(ol.extent.getCenter(extent));
    };
    Utils.prototype.select = function (layerType, propertieName, propertieValue, layers) {
        var featuresToSelect = [];
        layers.forEach(function (layer) {
            if (layer.get("type") == layerType) {
                var layerSource = layer.getSource();
                layerSource.getFeatures().forEach(function (feature) {
                    if (feature.getProperties()[propertieName] == propertieValue) {
                        featuresToSelect.push(feature);
                    }
                });
            }
        });
        return featuresToSelect;
    };
    Utils.prototype.containerForInfoWindow = function (feature) {
        var featureProperties = feature.getProperties();
        var featureType = featureProperties["featureType"];
        var resultHTML = '<div id="map-marker" style="height: auto;"><div class="map-num">';
        if (featureType == 'GRID_FOR_POIS') {
            resultHTML += 'ბლოკის N: ' + featureProperties["GRID_ID"] + '</br>';
            resultHTML += 'სტატუსი: ' + this.statusToGeorgian(featureProperties["STATUS"]) + '</br>';
            resultHTML += 'ოპერატორი: ' + featureProperties["USER_NAME"] + ' ' + featureProperties["USER_SURNAME"] + '</br>';
            resultHTML += 'დაწყება: ' + this.timestampToTimeString(featureProperties["START_DATE"]) + '</br>';
            resultHTML += 'დამთავრება: ' + this.timestampToTimeString(featureProperties["END_DATE"]) + '</br>';
            resultHTML += 'გზის სიგრძე: ' + this.formatFloat(featureProperties["ROAD_COUNT"]) + '</br>';
            resultHTML += 'შენობები: ' + featureProperties["BUILDING_COUNT"] + '</br>';
            resultHTML += 'დრო: ' + this.formatFloat(featureProperties["TOTAL_TIME"]) + '</br>';
            resultHTML += '<button onclick="map.clearInfoWindows()">Close</button>' + '</br>';
        }
        else if (featureType == 'ROAD_FOR_SIGNS') {
            resultHTML += 'გზის N: ' + featureProperties["ROAD_ID"] + '</br>';
            resultHTML += 'გზის ჯგუფის N: ' + featureProperties["ROAD_GROUP_ID"] + '</br>';
            resultHTML += 'სტატუსი: ' + this.statusToGeorgian(featureProperties["STATUS"]) + '</br>';
            resultHTML += 'ოპერატორის სახელი და გვარი: ' + featureProperties["USER_NAME"] + ' ' + featureProperties["USER_SURNAME"] + '</br>';
            resultHTML += 'დაწყება: ' + this.timestampToTimeString(featureProperties["START_DATE"]) + '</br>';
            resultHTML += 'დამთავრება: ' + this.timestampToTimeString(featureProperties["END_DATE"]) + '</br>';
            resultHTML += 'გზის სიგრძე: ' + this.formatFloat(featureProperties["ROAD_COUNT"]) + '</br>';
            resultHTML += 'გზის დასახელება: ' + featureProperties["ROAD_NAME"] + '</br>';
            resultHTML += '<button onclick="map.clearInfoWindows()">Close</button>' + '</br>';
        }
        else if (featureType == 'ROADS_FOR_VELO_TRACKS') {
            resultHTML += 'გზის N: ' + featureProperties["ROAD_ID"] + '</br>';
            resultHTML += 'გზის ჯგუფის N: ' + featureProperties["ROAD_GROUP_ID"] + '</br>';
            resultHTML += 'სტატუსი: ' + this.statusToGeorgian(featureProperties["STATUS"]) + '</br>';
            resultHTML += 'ოპერატორის სახელი და გვარი: ' + featureProperties["USER_NAME"] + ' ' + featureProperties["USER_SURNAME"] + '</br>';
            resultHTML += 'დაწყება: ' + this.timestampToTimeString(featureProperties["START_DATE"]) + '</br>';
            resultHTML += 'დამთავრება: ' + this.timestampToTimeString(featureProperties["END_DATE"]) + '</br>';
            resultHTML += 'გზის სიგრძე: ' + this.formatFloat(featureProperties["ROAD_COUNT"]) + '</br>';
            resultHTML += 'გზის დასახელება: ' + featureProperties["ROAD_NAME"] + '</br>';
            resultHTML += '<button onclick="map.clearInfoWindows()">Close</button>' + '</br>';
        }
        else if (featureType == 'VELO_TRACK') {
            resultHTML += 'ველო ტრასის ID: ' + featureProperties["ID"] + '</br>';
            resultHTML += '<button onclick="map.clearInfoWindows()">Close</button>' + '</br>';
        }
        else
            return null;
        return resultHTML;
    };
    Utils.prototype.timestampToTimeString = function (timeStamp) {
        if (timeStamp == null)
            return "";
        var time = new Date(timeStamp);
        return new Date(timeStamp).toLocaleDateString() + " (" + time.getHours() + ":" + time.getMinutes() + ")";
    };
    Utils.prototype.statusToGeorgian = function (status) {
        if (status == 1)
            return "მიმდინარე";
        if (status == 3)
            return "დაგეგმილი";
        if (status == 2)
            return "დასრულებული";
        return status;
    };
    Utils.prototype.formatFloat = function (float) {
        return float.toFixed(2);
    };
    Utils.prototype.toFeatureList = function (body) {
        return new ol.format.GeoJSON(({
            featureProjection: 'EPSG:3857'
        })).readFeatures(body);
    };
    Utils.prototype.convertFeature = function (body) {
        return new ol.format.GeoJSON(({
            featureProjection: 'EPSG:3857'
        })).writeFeature(body);
    };

    Utils.prototype.convertFeatures = function (body) {
        return new ol.format.GeoJSON(({
            featureProjection: 'EPSG:3857'
        })).writeFeatures(body);
    };

    Utils.prototype.getFeatureDescription = function (feature) {
        return feature.get('featureType') + '_' + feature.getProperties()['ID'];
    };
    return Utils;
}());
var utils = new Utils();
//# sourceMappingURL=Utils.js.map
