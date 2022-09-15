/**
 * Created by kokadva on 6/15/17.
 */
var WFSDataGatheringLayers = (function () {
    function WFSDataGatheringLayers() {
    }

    WFSDataGatheringLayers.prototype.poiLayer = function () {
        var url = DataGatheringLayerURLGetter.poiWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.POIFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'pois');
        layer.set("featureType", "POI");
        return layer;
    };



    WFSDataGatheringLayers.prototype.trafficSignLayer = function () {
        var url = DataGatheringLayerURLGetter.trafficSignWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.trafficSignFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'trafficSigns');
        layer.set("featureType", "trafficSign");
        return layer;
    };



    WFSDataGatheringLayers.prototype.busStopLayer = function () {
        var url = DataGatheringLayerURLGetter.busStopWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.busStationsStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'busStops');
        layer.set("featureType", "busStop");
        return layer;
    };



    WFSDataGatheringLayers.prototype.assignmentLayer = function () {
        var url = DataGatheringLayerURLGetter.assignments();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        //layer.setStyle(Styles.pointAssignmentLayerStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'assignments');
        layer.set("featureType", "assignment");
        return layer;
    };


    WFSDataGatheringLayers.prototype.RoadAssignmentLayer = function () {
        var url = DataGatheringLayerURLGetter.RoadAssignments();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        //layer.setStyle(Styles.pointAssignmentLayerStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'roadAssignments');
        layer.set("featureType", "roadAssignment");
        return layer;
    };


    WFSDataGatheringLayers.prototype.parcelLayer = function () {
        var url = DataGatheringLayerURLGetter.parcelWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        //layer.setStyle(Styles.parcelFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'parcels');
        layer.set("featureType", "parcel");
        return layer;
    };





    WFSDataGatheringLayers.prototype.parcelEntranceLayer = function () {
        var url = DataGatheringLayerURLGetter.parcelEntranceWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        //layer.setStyle(Styles.parcelFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'parcelEntrances');
        layer.set("featureType", "parcelEntrance");
        return layer;
    };


    WFSDataGatheringLayers.prototype.buildingLayer = function () {
        var url = DataGatheringLayerURLGetter.buildingWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
       // layer.setStyle(Styles.buildingFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'buildings');
        layer.set("featureType", "building");
        return layer;
    };


    WFSDataGatheringLayers.prototype.buildingEntranceLayer = function () {
        var url = DataGatheringLayerURLGetter.buildingEntranceWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
       // layer.setStyle(Styles.buildingFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'buildingEntrances');
        layer.set("featureType", "buildingEntrance");
        return layer;
    };


    WFSDataGatheringLayers.prototype.existingParcelLayer = function () {
        var url = DataGatheringLayerURLGetter.existingParcelWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        // layer.setStyle(Styles.buildingFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'existingParcels');
        layer.set("featureType", "existingParcel");
        return layer;
    };


    WFSDataGatheringLayers.prototype.existingBuildingLayer = function () {
        var url = DataGatheringLayerURLGetter.existingBuildingWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        // layer.setStyle(Styles.buildingFeatureStyle);
        layer.setOpacity(0.6);
        layer.set('name', 'existingBuildings');
        layer.set("featureType", "existingBuilding");
        return layer;
    };

    WFSDataGatheringLayers.prototype.existingObjectLayer = function () {
        return null;
    }

    WFSDataGatheringLayers.prototype.pebeLayersGrouped = function () {
        return null;
    }


    return WFSDataGatheringLayers;
}());
//# sourceMappingURL=WFSDataGatheringLayers.js.map