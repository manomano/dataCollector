/**
 * Created by kokadva on 6/15/17.
 */
var WFSAssignmentLayers = (function () {
    function WFSAssignmentLayers() {
    }
    WFSAssignmentLayers.prototype.gridsForPOIs = function () {
        var url = AssignmentLayerUrlGetter.gridsForPOIsWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.gridTaskStyleFunction);
        layer.setOpacity(0.6);
        layer.set("name", "gridsForPOIs");
        layer.set("featureType", "GRID_FOR_POIS");
        return layer;
    };
    WFSAssignmentLayers.prototype.roadsForSigns = function () {
        var url = AssignmentLayerUrlGetter.roadsForSignsWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.roadsTaskStyleFunction);
        layer.setOpacity(0.6);
        layer.set("name", "roadsForSigns");
        layer.set("featureType", "ROAD_FOR_SIGNS");
        return layer;
    };
    WFSAssignmentLayers.prototype.roadsForVeloTracks = function () {
        var url = AssignmentLayerUrlGetter.roadsForSignsWFS();
        var layer = LayerUtils.generateVectorLayerFromURL(url);
        layer.setStyle(Styles.roadsTaskStyleFunction);
        layer.setOpacity(0.6);
        layer.set("name", "roadsForVeloTracks");
        layer.set("featureType", "ROADS_FOR_VELO_TRACKS");
        return layer;
    };
    return WFSAssignmentLayers;
}());
//# sourceMappingURL=WFSAssignmentLayers.js.map