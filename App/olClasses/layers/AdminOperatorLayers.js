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

var AdminOperatorLayers = (function (_super) {
    __extends(AdminOperatorLayers, _super);
    function AdminOperatorLayers(dataGatheringLayers, assignmentLayers) {
        var _this = _super.call(this, dataGatheringLayers, assignmentLayers) || this;
        var defaultLayers = new DefaultLayers();

        var ortholist = defaultLayers.getOrtholist();

        var osm = defaultLayers.openStreetMapLayer();

        var wmsLayers = new WMSDataGatheringLayers();

       // var all = dataGatheringLayers.all();
        var busStop = dataGatheringLayers.busStopLayer();
        var trafficSigns = dataGatheringLayers.trafficSignLayer();
        var pois = dataGatheringLayers.poiLayer();
        var assignments = wmsLayers.assignmentLayer();
        var RoadAssignments = wmsLayers.RoadAssignmentLayer();
        var existingObject = dataGatheringLayers.existingObjectLayer();
        var pebeLayersGrouped = dataGatheringLayers.pebeLayersGrouped();



        _this.layersList = [
            osm,
            ...ortholist[0],
            assignments,
            RoadAssignments,
            pois,
            trafficSigns,
            busStop,
            existingObject,
            pebeLayersGrouped
        ];
        _this.layersMap = {
            "osm":osm,
            ...ortholist[1],
            "assignmentLayer": assignments,
            "RoadAssignments": RoadAssignments,
            "pois":pois,
            "trafficSigns":trafficSigns,
            "busStop":busStop,
            "existingObjects":existingObject,
            "all":pebeLayersGrouped
        };
        return _this;
    }
    return AdminOperatorLayers;
}(OperatorLayers));
