var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();

var PoiPebeOperatorLayers = (function (_super) {
  __extends(PoiPebeOperatorLayers, _super);
  function PoiPebeOperatorLayers(dataGatheringLayers, assignmentLayers) {
    var _this =
      _super.call(this, dataGatheringLayers, assignmentLayers) || this;
    var defaultLayers = new DefaultLayers();

    var ortholist = defaultLayers.getOrtholist();

    var wfsLayers = new WFSDataGatheringLayers();

    var pois = dataGatheringLayers.poiLayer();
    var assignments = wfsLayers.assignmentLayer();
    var parcel = dataGatheringLayers.parcelLayer();
    var parcelEntrance = dataGatheringLayers.parcelEntranceLayer();
    var building = dataGatheringLayers.buildingLayer();
    var buildingEntrance = dataGatheringLayers.buildingEntranceLayer();
    var existingParcels = dataGatheringLayers.existingParcelLayer();
    var existingBuildings = dataGatheringLayers.existingBuildingLayer();
    var pebeLayersGrouped = dataGatheringLayers.pebeLayersGrouped();
    var existingObject = dataGatheringLayers.existingObjectLayer();

    _this.layersList = [...ortholist[0], assignments, pois];
    _this.layersMap = {
      ...ortholist[1],
      assignmentLayer: assignments,
      pois: pois,
    };

    if (pebeLayersGrouped) {
      _this.layersList.push(pebeLayersGrouped);
      _this.layersMap.all = pebeLayersGrouped;
      _this.layersList.push(existingObject);
      _this.layersMap.existingObjects = existingObject;
    } else {
      _this.layersList.push(existingBuildings);
      _this.layersMap.existingBuildings = existingBuildings;
      _this.layersList.push(parcel);
      _this.layersList.push(parcelEntrance);
      _this.layersList.push(building);
      _this.layersList.push(buildingEntrance);

      _this.layersMap.parcel = parcel;
      _this.layersMap.parcelEntrance = parcelEntrance;
      _this.layersMap.building = building;
      _this.layersMap.buildingEntrance = buildingEntrance;
    }

    return _this;
  }
  return PoiPebeOperatorLayers;
})(OperatorLayers);
//# sourceMappingURL=AgaraOperatorsLayers.js.map
