var FeatureEditor = (function () {
  function FeatureEditor(map) {
    this.map = map;
    this.enabled = false;
    this.dialogOpened = false;
    this.initDialogueWindowParameters();
    //this.locationUpdater = new POILocationUpdater();
    this.initCallBacks();
  }
  FeatureEditor.prototype.initCallBacks = function () {
    this.onLocationUpdateSuccess = new Action();
    this.onLocationUpdateFail = new Action();
    this.onInfoUpdateSuccess = new Action();
    this.onInfoUpdateFail = new Action();
    //this.locationUpdater.onUpdateSuccess.addCallback(this.onLocationUpdateSuccess, this.onLocationUpdateSuccess.trigger);
    // this.locationUpdater.onUpdateFail.addCallback(this.onLocationUpdateFail, this.onLocationUpdateFail.trigger);
  };
  FeatureEditor.prototype.initDialogueWindowParameters = function () {
    this.dialog = document.querySelector("#dialog");
  };
  FeatureEditor.prototype.editFeature = function (feature) {
    this.editingFeature = feature;
    this.openDialog();
  };
  FeatureEditor.prototype.editLocation = function (feature) {
    //this.locationUpdater.update(this.editingFeature.getProperties()["ID"], feature.getGeometry());
  };
  FeatureEditor.prototype.editData = function (poiID) {
    var featureType = this.editingFeature.getProperties()["featureType"];
    if (featureType == "VELO_TRACK") {
      location.reload();
      return;
    }
    objectInfoUpdater.POIInfoUpdate(poiID);
  };
  FeatureEditor.prototype.deletePOI = function () {
    var featureType = this.editingFeature.getProperties()["featureType"];
    var confirmText = "წაიშალოს POI ?";
    if (featureType == "VELO_TRACK") confirmText = "წაიშალოს ველო გზა ?";
    if (featureType == "SIGN") confirmText = "წაიშალოს საგზაო ნიშანი ?";
    if (confirm(confirmText)) {
      new POIDeleter().deletePOI(this.editingFeature.getProperties()["ID"]);
    }
  };
  FeatureEditor.prototype.openDialog = function () {
    this.dialog.showModal();
    this.dialogOpened = true;
  };
  FeatureEditor.prototype.closeDialog = function () {
    if (this.dialogOpened) {
      this.dialog.close();
    }
    this.dialogOpened = false;
  };
  FeatureEditor.prototype.enable = function () {
    this.enabled = true;
  };
  FeatureEditor.prototype.disable = function () {
    this.enabled = false;
  };
  return FeatureEditor;
})();
//# sourceMappingURL=FeatureEditor.js.map
