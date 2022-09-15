/**
 * Created by kokadva on 6/16/17.
 */
var WFSInfoMarker = (function () {
  function WFSInfoMarker(map) {
    this.map = map;
    this.initMapInteraction();
    this.initSelectInteraction();
    this.enabled = false;
  }
  WFSInfoMarker.prototype.initMapInteraction = function () {
    var mapOnClickActionForSavingPositionCoordinates =
      this.getMapOnClickActionForSavingPositionCoordinates();
    this.map.on("click", mapOnClickActionForSavingPositionCoordinates);
  };
  WFSInfoMarker.prototype.getMapOnClickActionForSavingPositionCoordinates =
    function () {
      var self = this;
      return function (evt) {
        self.clickCoordinates = evt.coordinate;
      };
    };
  WFSInfoMarker.prototype.initSelectInteraction = function () {
    this.selectInteraction = new ol.interaction.Select();
    var onSelectForInfoListener = this.getOnSelectForInfoListener();
    this.selectInteraction.on("select", onSelectForInfoListener);
    this.selectInteraction.setActive(false);
    this.selectInteraction.setHitTolerance(10);
    this.map.addInteraction(this.selectInteraction);
  };
  WFSInfoMarker.prototype.getOnSelectForInfoListener = function () {
    var self = this;
    return function (evt) {
      if (evt.selected.length > 0) {
        var selectedFeature = evt.selected[0];
        self.showInfo(selectedFeature, self.clickCoordinates);
      } else {
        self.closeInfoWindow();
      }
    };
  };
  WFSInfoMarker.prototype.showInfo = function (feature, coordinates) {
    if (!this.enabled) return;
    var infoContent = utils.containerForInfoWindow(feature);
    if (infoContent == null)
      objectInfoViewer.objectInfoView(feature.getProperties()["ID"]);
    else PopUpWindowCaller.showPopUp(coordinates, infoContent);
  };
  WFSInfoMarker.prototype.enable = function () {
    this.enabled = true;
    this.selectInteraction.setActive(true);
  };
  WFSInfoMarker.prototype.disable = function () {
    this.enabled = false;
    this.selectInteraction.setActive(false);
    // this.closeInfoWindow();
  };
  WFSInfoMarker.prototype.closeInfoWindow = function () {
    PopUpWindowCaller.closePopUp();
  };
  return WFSInfoMarker;
})();
//# sourceMappingURL=WFSInfoMarker.js.map
