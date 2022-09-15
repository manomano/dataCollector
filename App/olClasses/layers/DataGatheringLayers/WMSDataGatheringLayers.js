var singleClick = ol.events.condition.singleClick;
var WMSDataGatheringLayers = (function () {
    function WMSDataGatheringLayers() {
    }


    WMSDataGatheringLayers.prototype.poiLayer = function () {
        var params = { 'LAYERS': currentConnections.geoServerWorkSpaceName +':POI', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'pois');
        Layer.set("featureType", "POI");
        return Layer;
    };

    WMSDataGatheringLayers.prototype.trafficSignLayer = function () {
        var params = { 'LAYERS': currentConnections.geoServerWorkSpaceName +':TRAFFIC_SIGN', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'trafficSigns');
        Layer.set("featureType", "trafficSign");
        return Layer;
    };


    WMSDataGatheringLayers.prototype.busStopLayer = function () {
        var params = { 'LAYERS': currentConnections.geoServerWorkSpaceName +':BUS_STOP', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'busStops');
        Layer.set("featureType", "busStop");
        return Layer;
    };


    WMSDataGatheringLayers.prototype.assignmentLayer = function () {
        var params = { 'LAYERS': currentConnections.geoServerWorkSpaceName +':ASSIGNMENT', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        if(utils.getRole()=='ROLE_ADMIN'){
            //params['CQL_FILTER'] = 'ID='+utils.getAuthorization().ongoingAssignmentId;
            params['CQL_FILTER'] = 'PLACE_ID='+utils.placeId();
        }

        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'assignments');
        Layer.set("featureType", "assignment");
        return Layer;
    };

    WMSDataGatheringLayers.prototype.RoadAssignmentLayer = function () {
        var params = { 'LAYERS': currentConnections.geoServerWorkSpaceName +':ROAD_ASSIGNMENT', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        if(utils.getRole()=='ROLE_ADMIN'){
            //params['CQL_FILTER'] = 'APPLICATION_USER_ID='+utils.getUserId();
            params['CQL_FILTER'] = 'PLACE_ID='+utils.placeId();
        }

        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'roadAssignments');
        Layer.set("featureType", "roadAssignment");
        return Layer;
    };



    WMSDataGatheringLayers.prototype.parcelLayer = function () {

        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':PARCEL', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'parcels');
        Layer.set("featureType", "parcel");
        Layer.set('type', 'tile');
        return Layer;
    };


    WMSDataGatheringLayers.prototype.parcelEntranceLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':PARCEL_ENTRANCE', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());

        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'parcelEntrances');
        Layer.set("featureType", "parcelEntrance");
        return Layer;
    };



    WMSDataGatheringLayers.prototype.buildingLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':BUILDING', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'buildings');
        Layer.set("featureType", "building");
        return Layer;
    };



    WMSDataGatheringLayers.prototype.buildingEntranceLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':BUILDING_ENTRANCE', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'buildingEntrances');
        Layer.set("featureType", "buildingEntrance");
        return Layer;
    };


    WMSDataGatheringLayers.prototype.existingParcelLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':EXISTING_PARCEL', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        params['crs'] = 'EPSG:4326';
        params['FORMAT'] = 'image/png'
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'existingParcels');
        Layer.set("featureType", "existingParcel");
        return Layer;
    };



    WMSDataGatheringLayers.prototype.existingBuildingLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':EXISTING_BUILDING', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        params['crs'] = 'EPSG:4326';
        params['FORMAT'] = 'image/png'
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'existingBuildings');
        Layer.set("featureType", "existingBuilding");
        return Layer;
    };




    WMSDataGatheringLayers.prototype.existingObjectLayer = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':EXISTING_OBJECTS', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        params['crs'] = 'EPSG:4326';


        params['FORMAT'] = 'image/png'
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'existingParcels');
        Layer.set("featureType", "existingParcel");
        return Layer;
    };


    WMSDataGatheringLayers.prototype.all = function () {
        var params = { 'LAYERS': NGCACHEServerInfo.NAME +':ALL', 'TILED': true };
        params['env'] = LayerUtils.getPlaceIdEnvVariable(utils.placeId()) + LayerUtils.getUserIdEnvVariable(utils.getUserId());
        params['crs'] = 'EPSG:4326';
        params['FORMAT'] = 'image/png';
        params['FEATURE_COUNT'] = 20;
        var Layer = LayerUtils.createTileLayer(params);
        Layer.set('name', 'existingParcels');
        Layer.set("featureType", "existingParcel");
        return Layer;
    };



    return WMSDataGatheringLayers;
}());
//# sourceMappingURL=WMSDataGatheringLayers.js.map