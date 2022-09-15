var NGCACHEServerInfo = (function () {
    function NGCACHEServerInfo() {
    }
    return NGCACHEServerInfo;
}());


NGCACHEServerInfo.NGCACHE_URL_TEMPLATE = currentConnections.NGCACHE_URL_TEMPLATE;

NGCACHEServerInfo.NAME = currentConnections.geoServerWorkSpaceName;
//NGCACHEServerInfo.ALL = NGCACHEServerInfo.NAME + ":tst_grp";
NGCACHEServerInfo.POI = NGCACHEServerInfo.NAME + ":POI";
NGCACHEServerInfo.TRAFFIC_SIGN = NGCACHEServerInfo.NAME + ":TRAFFIC_SIGN";
NGCACHEServerInfo.BUS_STOP = NGCACHEServerInfo.NAME + ":BUS_STOP";
NGCACHEServerInfo.AREA_ASSIGNMENT = NGCACHEServerInfo.NAME + ":ASSIGNMENT";
NGCACHEServerInfo.ROAD_ASSIGNMENT = NGCACHEServerInfo.NAME + ":ROAD_ASSIGNMENT";
NGCACHEServerInfo.PARCEL = NGCACHEServerInfo.NAME + ":PARCEL";
NGCACHEServerInfo.PARCEL_ENTRANCE = NGCACHEServerInfo.NAME + ":PARCEL_ENTRANCE";
NGCACHEServerInfo.BUILDING = NGCACHEServerInfo.NAME + ":BUILDING";
NGCACHEServerInfo.BUILDING_ENTRANCE = NGCACHEServerInfo.NAME + ":BUILDING_ENTRANCE";
NGCACHEServerInfo.EXISTING_PARCEL = NGCACHEServerInfo.NAME + ":EXISTING_PARCEL";
NGCACHEServerInfo.EXISTING_OBJECTS = NGCACHEServerInfo.NAME + ":EXISTING_OBJECTS";
NGCACHEServerInfo.ALL = NGCACHEServerInfo.NAME + ":ALL";


var NGCACHEDataGatheringLayers = (function () {
    function NGCACHEDataGatheringLayers() {
    }



    NGCACHEDataGatheringLayers.prototype.all = function () {

        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.ALL);
        Layer.set('name', 'all');
        Layer.set("featureType", "all");
        return Layer;
    };


    NGCACHEDataGatheringLayers.prototype.poiLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.POI);
        Layer.set('name', 'pois');
        Layer.set("featureType", "POI");
        return Layer;
    };

    NGCACHEDataGatheringLayers.prototype.trafficSignLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.TRAFFIC_SIGN);
        Layer.set('name', 'trafficSigns');
        Layer.set("featureType", "trafficSign");
        return Layer;
    };


    NGCACHEDataGatheringLayers.prototype.busStopLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.BUS_STOP);
        Layer.set('name', 'busStops');
        Layer.set("featureType", "busStop");
        return Layer;
    };


    NGCACHEDataGatheringLayers.prototype.assignmentLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.AREA_ASSIGNMENT);
        Layer.set('name', 'assignments');
        Layer.set("featureType", "assignment");
        return Layer;
    };

    NGCACHEDataGatheringLayers.prototype.RoadAssignmentLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.ROAD_ASSIGNMENT);
        Layer.set('name', 'roadAssignments');
        Layer.set("featureType", "roadAssignment");
        return Layer;
    };



    NGCACHEDataGatheringLayers.prototype.parcelLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.PARCEL);
        Layer.set('name', 'parcels');
        Layer.set("featureType", "parcel");
        Layer.set('type', 'tile');
        return Layer;
    };


    NGCACHEDataGatheringLayers.prototype.parcelEntranceLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.PARCEL_ENTRANCE);
        Layer.set('name', 'parcelEntrances');
        Layer.set("featureType", "parcelEntrance");
        return Layer;
    };



    NGCACHEDataGatheringLayers.prototype.buildingLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.BUILDING);
        Layer.set('name', 'buildings');
        Layer.set("featureType", "building");
        return Layer;
    };



    NGCACHEDataGatheringLayers.prototype.buildingEntranceLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.BUILDING_ENTRANCE);
        Layer.set('name', 'buildingEntrances');
        Layer.set("featureType", "buildingEntrance");
        return Layer;
    };


    NGCACHEDataGatheringLayers.prototype.existingParcelLayer = function () {
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.EXISTING_PARCEL);
        Layer.set('name', 'existingParcels');
        Layer.set("featureType", "existingParcel");
        return Layer;
    };



    NGCACHEDataGatheringLayers.prototype.existingObjectLayer = function () {
        var params = { 'LAYERS': 'DATA_COLLECTOR:EXISTING_OBJECTS', 'TILED': false };
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.EXISTING_OBJECTS);
        Layer.set('name', 'existingObjects');
        Layer.set("featureType", "existingObject");
        return Layer;
    };

    NGCACHEDataGatheringLayers.prototype.existingBuildingLayer = function () {
        return null;
    }


    NGCACHEDataGatheringLayers.prototype.pebeLayersGrouped = function () {
        var params = { 'LAYERS': 'DATA_COLLECTOR:ALL', 'TILED': false };
        var Layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.ALL);
        Layer.set('name', 'all');
        Layer.set("featureType", "all");
        return Layer;
    };



    return NGCACHEDataGatheringLayers;
}());
//# sourceMappingURL=NGCACHEDataGatheringLayers.js.map