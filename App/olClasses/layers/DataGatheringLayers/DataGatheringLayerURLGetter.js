var apiUrl = utils.apiURL;
var rolePrefix = utils.getAuthorization()
  ? utils.getAuthorization().role == "ROLE_ADMIN"
    ? "admin/"
    : ""
  : "";

var DataGatheringLayerURLGetter = (function () {
  function DataGatheringLayerURLGetter() {}
  DataGatheringLayerURLGetter.poiWFS = function () {
    return apiUrl + rolePrefix + "pois";
  };

  DataGatheringLayerURLGetter.busStopWFS = function () {
    return apiUrl + rolePrefix + "busStops";
  };

  DataGatheringLayerURLGetter.trafficSignWFS = function () {
    return apiUrl + rolePrefix + "trafficSigns";
  };

  DataGatheringLayerURLGetter.parcelWFS = function () {
    return apiUrl + rolePrefix + "pebe/parcels";
  };

  DataGatheringLayerURLGetter.parcelEntranceWFS = function () {
    return apiUrl + rolePrefix + "pebe/parcelEntrances";
  };

  DataGatheringLayerURLGetter.buildingWFS = function () {
    return apiUrl + rolePrefix + "pebe/buildings";
  };

  DataGatheringLayerURLGetter.buildingEntranceWFS = function () {
    return apiUrl + rolePrefix + "pebe/buildingEntrances";
  };

  DataGatheringLayerURLGetter.assignments = function () {
    return apiUrl + rolePrefix + "assignments/area-operator-assignments";
  };

  DataGatheringLayerURLGetter.RoadAssignments = function () {
    return apiUrl + rolePrefix + "roadAssignments/road-operator-assignments";
  };

  DataGatheringLayerURLGetter.existingParcelWFS = function () {
    return apiUrl + rolePrefix + "pebe/existingParcels";
  };

  DataGatheringLayerURLGetter.existingBuildingWFS = function () {
    return apiUrl + rolePrefix + "pebe/existingBuildings";
  };

  return DataGatheringLayerURLGetter;
})();
//# sourceMappingURL=DataGatheringLayerURLGetter.js.map
