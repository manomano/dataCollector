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

var TrafficSignOperatorLayers = (function (_super) {
    __extends(TrafficSignOperatorLayers, _super);
    function TrafficSignOperatorLayers(dataGatheringLayers, assignmentLayers) {
        var _this = _super.call(this, dataGatheringLayers, assignmentLayers) || this;
        var defaultLayers = new DefaultLayers();
        var ortholist = defaultLayers.getOrtholist();

        var wfsLayers = new WFSDataGatheringLayers();

        var busStop = dataGatheringLayers.busStopLayer();
        var trafficSigns = dataGatheringLayers.trafficSignLayer();
        var RoadAssignments = wfsLayers.RoadAssignmentLayer();

        _this.layersList = [
            ...ortholist[0],
            RoadAssignments,
            trafficSigns,
            busStop
        ];
        _this.layersMap = {
            ...ortholist[1],
            "assignmentLayer": RoadAssignments,
            "trafficSigns": trafficSigns,
            "busStop":busStop
        };
        return _this;
    }
    return TrafficSignOperatorLayers;
}(OperatorLayers));
