/**
 * Created by mjaparidze on 12/17/2018.
 */

var featureSelectorCoord = (function () {
  function featureSelectorController(map, layers, callback) {
    var isWMS = utils.isWMS();
    this.type = utils.getRole() == "ROLE_ADMIN" ? 2 : isWMS ? 3 : 1;

    if (this.type == 1) {
      this.selector = new WFSFeatureSelector(map, layers, callback);
      this.selectInteraction = this.selector.selectInteraction;
    } else if (this.type == 2) {
      this.selector = new WMSFeatureSelector(map, callback);
    } else {
      this.selectorF = new WFSFeatureSelector(map, layers, callback);
      this.selectorM = new WMSFeatureSelector(map, callback);
      this.selectInteraction = this.selectorF.selectInteraction;
    }
  }

  featureSelectorController.prototype.enable = function () {
    if (this.type < 3) {
      this.selector.enable();
    } else {
      this.selectorF.enable();
      this.selectorM.enable();
    }
  };

  featureSelectorController.prototype.disable = function () {
    if (this.type < 3) {
      this.selector.disable();
    } else {
      this.selectorF.disable();
      this.selectorM.disable();
    }
  };

  featureSelectorController.prototype.getSelectedFeatures = function () {
    if (this.type < 3) {
      return this.selector.getSelectedFeatures();
    } else {
      //var features = this.selectorF.getSelectedFeatures();
      var features = Object.assign([], this.selectorF.getSelectedFeatures());
      features.push(...this.selectorM.getSelectedFeatures());
      return features;
    }
  };

  featureSelectorController.prototype.clearSelection = function () {
    if (this.type < 3) {
      this.selector.clearSelection();
    } else {
      this.selectorF.clearSelection();
      this.selectorM.clearSelection();
    }
  };

  featureSelectorController.prototype.selectFeature = function (feature) {
    if (this.type < 3) {
      this.selector.selectFeature(feature);
    } else {
      var featureType = feature.get("featureType") || feature.get("name");
      if (featureType.indexOf("assignment") >= 0) {
        this.selectorF.selectFeature(feature);
      } else {
        this.selectorM.selectFeature(feature);
      }
    }
  };

  featureSelectorController.prototype.selectFeatures = function (features) {
    for (let i in features) {
      this.selectFeature(features[i]);
    }
  };
  return featureSelectorController;
})();
