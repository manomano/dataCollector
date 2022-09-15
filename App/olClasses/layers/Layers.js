var Layers = (function () {
    function Layers() {
    }
    return Layers;
}());



var AbstractLayerFactory = (function () {
    function AbstractLayerFactory(layerFactory) {
        this.layerFactory = layerFactory;
    }
    AbstractLayerFactory.prototype.createLayer = function (layerName) {
        return this.layerFactory.createLayer(layerName);
    };
    return AbstractLayerFactory;
}());




var GeoserverLayerFactory = (function () {
    function GeoserverLayerFactory() {
    }
    GeoserverLayerFactory.prototype.createLayer = function (layerName) {
        switch (layerName) {

            case "pois":
                return new WMSDataGatheringLayers().poiLayer();
            case "trafficSigns":
                return new WMSDataGatheringLayers().trafficSignLayer();
            case "busStops":
                return new WMSDataGatheringLayers().busStopLayer();
            case "busStations":
                return new WMSDataGatheringLayers().busStopLayer();
            case "roadAssignments":
                return new WMSDataGatheringLayers().RoadAssignmentLayer();
            case "assignments":
                return new WMSDataGatheringLayers().assignmentLayer();
            case "parcels":
                return new WMSDataGatheringLayers().parcelLayer();
            case "parcelEntrances":
                return new WMSDataGatheringLayers().parcelEntranceLayer();
            case "buildings":
                return new WMSDataGatheringLayers().buildingLayer();
            case "buildingEntrances":
                return new WMSDataGatheringLayers().buildingEntranceLayer();
            case "existingParcels":
                return new WMSDataGatheringLayers().existingParcelLayer();
            case "existingBuildings":
                return new WMSDataGatheringLayers().existingBuildingLayer();
            case "existingObjects":
                return new WMSDataGatheringLayers().existingObjectLayer();
            case "all":
                return new WMSDataGatheringLayers().all();
        }
    };
    return GeoserverLayerFactory;
}());