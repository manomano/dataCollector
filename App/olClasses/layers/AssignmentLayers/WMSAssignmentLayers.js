var WMSAssignmentLayers = (function () {
  function WMSAssignmentLayers() {}
  WMSAssignmentLayers.prototype.gridsForPOIs = function () {
    var params = { LAYERS: "cite:GRIDS", TILED: true };
    params["env"] =
      LayerUtils.getPlaceIdEnvVariable(userInfo.getUserPlaceId()) +
      LayerUtils.getUserIdEnvVariable(userInfo.getUserId());
    var gridsForPoi = LayerUtils.createTileLayer(params);
    gridsForPoi.set("name", "gridsForPOIs");
    gridsForPoi.set("featureType", "GRID_FOR_POIS");
    return gridsForPoi;
  };
  WMSAssignmentLayers.prototype.roadsForSigns = function () {
    var params = { LAYERS: "cite:ROADS_FOR_SIGNS", TILED: true };
    params["env"] =
      LayerUtils.getPlaceIdEnvVariable(userInfo.getUserPlaceId()) +
      LayerUtils.getUserIdEnvVariable(userInfo.getUserId());
    var roadsForSigns = LayerUtils.createTileLayer(params);
    roadsForSigns.set("name", "roadsForSigns");
    roadsForSigns.set("featureType", "ROAD_FOR_SIGNS");
    return roadsForSigns;
  };
  WMSAssignmentLayers.prototype.roadsForVeloTracks = function () {
    var params = { LAYERS: "cite:ROADS_FOR_VELO_TRACKS", TILED: true };
    params["env"] =
      LayerUtils.getPlaceIdEnvVariable(userInfo.getUserPlaceId()) +
      LayerUtils.getUserIdEnvVariable(userInfo.getUserId());
    var roadsForVeloTracks = LayerUtils.createTileLayer(params);
    roadsForVeloTracks.set("name", "roadsForVeloTracks");
    roadsForVeloTracks.set("featureType", "ROADS_FOR_VELO_TRACKS");
    return roadsForVeloTracks;
  };
  return WMSAssignmentLayers;
})();
//# sourceMappingURL=WMSAssignmentLayers.js.map
