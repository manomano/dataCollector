/**
 * Created by kokadva on 7/6/17.
 */
var NGCACHEAssignmentLayer = (function () {
    function NGCACHEAssignmentLayer() {
    }
    NGCACHEAssignmentLayer.prototype.gridsForPOIs = function () {
        var layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.GRIDS_FOR_POIS_LAYER_NAME);
        layer.set("name", "gridsForPOIs");
        layer.set("featureType", "GRID_FOR_POIS");
        return layer;
    };
    NGCACHEAssignmentLayer.prototype.roadsForSigns = function () {
        var layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.ROADS_FOR_SINGS_LAYER_NAME);
        layer.set("name", "roadsForSigns");
        layer.set("featureType", "ROAD_FOR_SIGNS");
        return layer;
    };
    NGCACHEAssignmentLayer.prototype.roadsForVeloTracks = function () {
        var layer = LayerUtils.generateNGCACHETileLayer(NGCACHEServerInfo.ROADS_FOR_VELO_TRACKS);
        layer.set("name", "roadsForVeloTracks");
        layer.set("featureType", "ROADS_FOR_VELO_TRACKS");
        return layer;
    };
    return NGCACHEAssignmentLayer;
}());
//# sourceMappingURL=NGCACHEAssignmentLayer.js.map