var MapController = (function () {
  function MapController(layers, mapContainerID, defaultView) {
    this.getDefaultView = defaultView;
    this.layers = layers;
    this.initMap(mapContainerID);

    OnClickFeatureGetter.init(this.map, layers);
    OnClickFeatureGetter.addCallback(
      OnSelectFeatureChooser,
      OnSelectFeatureChooser.choose
    );
    //PopUpWindowCaller.init(this.map);
    this.initInteractionTools();
  }
  MapController.prototype.initMap = function (target) {
    var app = {
      RotateNorthControl: null,
    };
    var self = this;
    app.RotateNorthControl = function (opt_options) {
      var options = opt_options || {};
      var button = document.createElement("button");
      button.innerHTML = "N";
      var this_ = this;
      var handleRotateNorth = function () {
        this_.getMap().getView().setRotation(0);
      };
      button.addEventListener("click", handleRotateNorth, false);
      button.addEventListener("touchstart", handleRotateNorth, false);
      var element = document.createElement("div");
      element.className = "rotate-north ol-unselectable ol-control";
      element.appendChild(button);
      ol.control.Control.call(this, {
        element: element,
        target: options.target,
      });
    };

    ol.inherits(app.RotateNorthControl, ol.control.Control);
    var view = utils.getSavedView(this.layers);

    if (view == null) view = utils.getDefaultView();
    this.map = new ol.Map({
      //controls: new ol.control.Control({rotateOptions:{className:'custom-rotate'}}),
      layers: self.layers,
      view: view,
      target: target,
      logo: false,
      controls: [],
    });

    this.map.addLayer(utils.userGPSVectorLayer);

    this.map.on("moveend", function () {
      var center = view.getCenter();
      var hash =
        "#map=" +
        view.getZoom() +
        "/" +
        Math.round(center[0] * 100) / 100 +
        "/" +
        Math.round(center[1] * 100) / 100 +
        "/" +
        view.getRotation() +
        "/";
      self.layers.forEach(function (layer) {
        hash +=
          (function () {
            if (layer.getVisible()) return 1;
            return 0;
          })() + "/";
      });

      var state = {
        zoom1: view.getZoom(),
        center1: view.getCenter(),
        rotation1: view.getRotation(),
        time: new Date(),
        layers: self.layers
          .filter((x) => x.getVisible())
          .map((x) => x.get("name")),
      };

      window[utils.getStorageType()].setItem("mapState", JSON.stringify(state));

      if (typeof sessionController !== "undefined") {
        sessionController.setSession(
          JSON.stringify({
            Authorization: JSON.parse(
              window[utils.getStorageType()].getItem("Authorization")
            ),
            mapState: state,
          })
        );
      }
    });
  };
  MapController.prototype.initInteractionTools = function () {
    this.featureEditor = new FeatureEditor(this.map);
    this.measurer = new Measurer(this.map, utils.measurementLayer);
    /*this.DrawingLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style:Styles.CurrentDrawingStyle,
            renderOrder: null,
            name:'forDrawing'
        });*/

    this.userLocator = new UserLocator(utils.userGPSVectorLayerSource);
    this.userLocator.enable();
    this.infoMarker = new WFSInfoMarker(this.map);
  };

  MapController.prototype.startMeasuring = function (measurementType) {
    this.defaultMode();
    this.measurer.addInteraction(measurementType);
  };

  MapController.prototype.removeDrawingLayer = function () {
    if (this.DrawingLayer || this.featureDrawer) {
      var index = -1;
      for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i].get("name") == "forDrawing") {
          var index = i;
        }
      }
      if (index >= 0) {
        this.layers.splice(index, 1);
        this.map.removeLayer(this.DrawingLayer);
        this.DrawingLayer = null;
        this.featureDrawer = null;
      }
    }
  };

  MapController.prototype.createDrawingLayer = function (style) {
    this.removeDrawingLayer();

    this.DrawingLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: style ? style : Styles.CurrentDrawingStyle,
      //renderOrder: null,
      name: "forDrawing",
    });
    this.layers.push(this.DrawingLayer);
    this.featureDrawer = new FeatureDrawer(this.map, this.DrawingLayer);
  };

  MapController.prototype.createFeatureDrawer = function () {
    this.featureDrawer = new FeatureDrawer(this.map, this.DrawingLayer);
  };

  MapController.prototype.myLocation = function () {
    var myLocation = this.userLocator.getLocationPoint();
    utils.focusView(this.map, [myLocation]);
  };
  MapController.prototype.setDefaultView = function () {
    //TODO refactor
    this.map.getView().setCenter(this.getDefaultView().getCenter());
    this.map.getView().setZoom(12);
  };
  MapController.prototype.enableGetInfo = function () {
    this.infoMarker.enable();
  };
  MapController.prototype.editFeature = function () {
    var selectedFeatures = this.featureSelector.getSelectedFeatures();
    if (selectedFeatures.length == 0) {
      alert("არაფერი არ მონიშნულა");
    } else {
      this.featureEditor.editFeature(selectedFeatures[0]);
    }
  };
  MapController.prototype.editFeatureLocation = function () {
    this.featureEditor.closeDialog();
    var selectedFeatures = this.featureSelector.getSelectedFeatures();
    this.featureDrawer.redrawFeature(selectedFeatures[0]);
  };
  MapController.prototype.editFeatureData = function () {
    this.featureEditor.closeDialog();
    var selectedFeatures = this.featureSelector.getSelectedFeatures();
    this.featureEditor.editData(selectedFeatures[0].getProperties()["ID"]);
  };

  MapController.prototype.closeEditFeatureDialog = function () {
    this.featureEditor.closeDialog();
  };

  MapController.prototype.selectFeature = function () {
    this.defaultMode();
    this.featureSelector.enable();
  };

  MapController.prototype.enableInteraction = function (interactionName, mode) {
    this.defaultMode();
    this.featureSelector.setActiveByInteractionName(interactionName, mode);
  };

  //setActiveByInteractionName

  MapController.prototype.dragFeature = function () {
    this.defaultMode();
    this.featureSelector.enable();
  };

  MapController.prototype.startDrawing = function (interactionName) {
    this.defaultMode();
    this.featureDrawer.startDrawing(interactionName);
  };

  MapController.prototype.enableInteraction = function (interactionName, mode) {
    this.featureSelector.enableInteraction(interactionName, mode);
  };

  MapController.prototype.select = function (selectType, value) {
    this.defaultMode();
    var self = this;
    var searcher = utils.georgianEnglishSearchTypeNamingMap[selectType];
    this.featureSelector.clearSelection();
    searcher
      .addOnCompleteCallback(this, function (responseBody) {
        var features = utils.toFeatureList(responseBody);
        console.log(responseBody);
        self.featureSelector.enable();
        self.featureSelector.selectFeatures(features);
      })
      .search(value);
  };
  MapController.prototype.clearInfoWindows = function () {
    this.infoMarker.closeInfoWindow();
  };
  MapController.prototype.defaultMode = function () {
    if (this.featureSelector) {
      this.featureSelector.disable();
    }
    this.infoMarker.disable();

    this.featureEditor.disable();
    if (this.featureDrawer) {
      this.featureDrawer.disable();
    }

    this.userLocator.disable();
    this.measurer.disable();
  };
  MapController.prototype.deleteSelectedFeature = function () {
    this.featureSelector.removeSelectedFeature();
  };

  return MapController;
})();
//# sourceMappingURL=MapController.js.map
