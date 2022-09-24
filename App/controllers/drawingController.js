(function () {
  var DrawingControllerService = function (
    $rootScope,
    MessagingService,
    ParcelService,
    simpleObjectService
  ) {
    var isactive = false;
    var me = this;
    this.featureType = "Polygon";
    me.interactionName = "";

    function DrawEndCallBack(name, feature) {
      me.featureSelector.selectFeature(feature);
    }

    function setIsactive(act) {
      isactive = act;

      if (!act) {
        me.featureSelector.disable();
        $rootScope.map.map.removeInteraction(
          me.featureSelector.selectInteraction
        );
        $rootScope.map.map.removeInteraction(
          me.featureSelector.modifyInteraction
        );
        $rootScope.map.map.removeInteraction(
          me.featureSelector.dragInteraction
        );
        me.featureSelector = null;
        me.featureType = null;
      }
    }

    function getStatus() {
      return isactive;
    }
    this.init = function (interactionName, featureToSnap, id) {
      this.saveButtonState = false;
      this.editing = false;
      this.id = id;
      $rootScope.map.createDrawingLayer(
        interactionName == "trafficSignGeometry"
          ? Styles.trafficSignFeatureStyle
          : null
      );
      $rootScope.map.featureDrawer.onDrawnAction.addCallback(
        $rootScope.map.featureDrawer,
        DrawEndCallBack
      );
      this.featureSelector = new WFSFeatureSelector(
        $rootScope.map.map,
        $rootScope.map.layers
      );
      this.featureSelector.addOtherInteractions();
      me.interactionName = interactionName;
      $rootScope.map.startDrawing(interactionName);
      this.subscriber = new Action();
      this.featureType = utils.featureNameTypeMap[me.interactionName];
      if (featureToSnap) {
        this.featureSelector.addFeatureToSnap(featureToSnap);
      }
    };

    this.initEdit = function (
      interactionName,
      feature,
      featureToSnap,
      editing,
      id
    ) {
      this.saveButtonState = false;
      this.interactionName = interactionName;
      this.editing = editing;
      this.id = id;

      $rootScope.map.createDrawingLayer();
      $rootScope.map.featureDrawer.onDrawnAction.addCallback(
        $rootScope.map.featureDrawer,
        DrawEndCallBack
      );
      this.featureSelector = new WFSFeatureSelector(
        $rootScope.map.map,
        $rootScope.map.layers
      );
      this.featureSelector.addOtherInteractions();
      if (feature) {
        $rootScope.map.DrawingLayer.getSource().addFeature(feature);
        this.featureSelector.selectFeature(feature);
      } else {
        $rootScope.map.startDrawing(interactionName);
      }

      this.subscriber = new Action();

      if (featureToSnap) {
        this.featureSelector.addFeatureToSnap(featureToSnap);
      }
    };

    this.createLayer = function () {
      this.thelayer = this.map.createFeatureDrawer();
    };

    this.turnOn = function () {
      setIsactive(true);
    };

    this.getStatus = function () {
      return getStatus();
    };

    this.addCallback = function (args, func) {
      this.subscriber.addCallback(args, func);
    };

    this.editGeometry = function () {
      this.featureSelector.enableInteraction("dragInteraction", false);
      // this.featureSelector.enableInteraction('selectInteraction',true);
      this.featureSelector.enableInteraction("modifyInteraction", true);
      this.featureSelector.enableInteraction("snapInteraction", true);
    };

    this.deleteGeometry = function () {
      this.featureSelector.removeSelectedFeature();
    };

    this.dragGeometry = function () {
      $rootScope.map.featureDrawer.disable();
      this.featureSelector.enableInteraction("modifyInteraction", false);
      this.featureSelector.enableInteraction("selectInteraction", true);
      this.featureSelector.enableInteraction("dragInteraction", true);
      this.featureSelector.enableInteraction("snapInteraction", true);
    };

    this.saveGeometry = function () {
      me.saveButtonState = true;

      if ($rootScope.map.featureDrawer.state !== 2) {
        MessagingService.displayError("დაასრულეთ ხაზვა!");
        return;
      }

      var feature = JSON.parse(
        utils.convertFeature(
          $rootScope.map.DrawingLayer.getSource().getFeatures()[0]
        )
      );
      if (me.id) {
        feature.id = me.id;
      }

      var rawFeature = $rootScope.map.DrawingLayer.getSource().getFeatures()[0];

      if (
        [
          "parcelEntranceGeometry",
          "parcelGeometry",
          "buildingGeometry",
          "buildingEntranceGeometry",
        ].indexOf(me.interactionName) >= 0
      ) {
        ParcelService.router(me.editing, me.interactionName, feature).then(
          function (response) {
            setIsactive(false);

            $rootScope.map.removeDrawingLayer();
            if (response.data) {
              feature.ID = response.data.properties.ID;
            }
            me.subscriber.trigger(feature, rawFeature);
          },
          function (args) {
            me.saveButtonState = false;
            MessagingService.displayError("დაფიქსირდა პრობლემა");
          }
        );
      } else {
        var id = this.id
          ? this.id
          : feature.properties
          ? feature.properties.ID
          : null;

        simpleObjectService
          .router({
            feature: feature.geometry,
            serviceName: me.interactionName,
            id: id,
          })
          .then(
            function (response) {
              setIsactive(false);
              $rootScope.map.removeDrawingLayer();
              me.subscriber.trigger(response);
            },
            function () {
              MessagingService.displayError("დაფიქსირდა პრობლემა");
              me.saveButtonState = false;
            }
          );
      }
    };

    this.exit = function () {
      setIsactive(false);
      $rootScope.map.DrawingLayer.getSource().clear();
      $rootScope.map.defaultMode();
      $rootScope.map.removeDrawingLayer();
      this.subscriber.trigger();
    };

    this.stopDrawing = function () {
      if (
        !$rootScope.map.featureDrawer.drawingInteractions[
          utils.featureNameTypeMap[me.interactionName]
        ].a
      ) {
        return;
      }
      if (
        $rootScope.map.featureDrawer.drawingInteractions[
          utils.featureNameTypeMap[me.interactionName]
        ].a[0].length < 4
      ) {
        return;
      }
      $rootScope.map.featureDrawer.drawingInteractions[
        utils.featureNameTypeMap[me.interactionName]
      ].finishDrawing();
    };
  };

  DrawingControllerService.$inject = [
    "$rootScope",
    "MessagingService",
    "ParcelService",
    "simpleObjectService",
  ];
  angular
    .module("datacollection.services")
    .service("DrawingControllerService", DrawingControllerService);
})();
