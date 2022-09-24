/**
 * Created by kokadva on 5/24/17.
 */

window.parseResponse = function (data) {};
var OnClickFeatureGetter = (function () {
  function OnClickFeatureGetter() {}
  OnClickFeatureGetter.initInteraction = function () {
    var self = this;
    var view = this.map.getView();
    window.parseResponse = function (data) {};
    this.map.on("singleclick", function (evt) {
      if (!self.enabled()) return;
      self.clickCoordinates = evt.coordinate;

      var visibleLayers = self.layers
        .filter(function (layer) {
          return layer.getVisible();
        })
        .filter(function (layer) {
          return (
            (layer.get("type") == "tile" || layer.type == "TILE") &&
            layer.get("name") !== "OSM" &&
            layer.get("name").toLowerCase().indexOf("ortho") < 0 &&
            layer.get("type") !== "ortho" &&
            (self.layerFilter
              ? self.layerFilterIsActive &&
                self.layerFilter.layers.indexOf(layer.get("name")) >= 0
              : true)
          );
        });

      if (visibleLayers.find((x) => x.get("name") == "existingObjects")) {
        var existingParcels = new AbstractLayerFactory(
          new GeoserverLayerFactory()
        ).createLayer("existingParcels");
        var existingBuildings = new AbstractLayerFactory(
          new GeoserverLayerFactory()
        ).createLayer("existingBuildings");
        existingParcels.set("name", "existingParcels");
        existingBuildings.set("name", "existingBuildings");
        visibleLayers.push(existingParcels);
        visibleLayers.push(existingBuildings);
        var ind = visibleLayers.findIndex(
          (x) => x.get("name") == "existingObjects"
        );
        visibleLayers.splice(ind, 1);
      }

      var selectedFeatures = [];
      var iterationObject = { lastFeatureCount: 0 };
      if (visibleLayers.length == 0) {
        return;
      }
      var oneFeature = {};
      var x = function (layer) {
        var theLayer = new AbstractLayerFactory(
          new GeoserverLayerFactory()
        ).createLayer(layer.get("name"));
        var url;

        if (theLayer) {
          url = theLayer
            .getSource()
            .getGetFeatureInfoUrl(
              evt.coordinate,
              view.getResolution(),
              view.getProjection(),
              { INFO_FORMAT: "text/javascript" }
            );
        }

        if (!url) {
          return;
        }

        // var url = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, view.getResolution(), view.getProjection(), { 'INFO_FORMAT': 'text/javascript' });
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: url,
            dataType: "jsonp",
            jsonpCallback: "parseResponse",
          }).then(
            function (response) {
              iterationObject.lastFeatureCount = 0;
              response.features.map(function (x) {
                var string = x.id.split(".")[0].toLocaleLowerCase();
                x.properties.featureType =
                  string.indexOf("_") >= 0
                    ? string.replace(
                        "_" + string[string.indexOf("_") + 1],
                        string[string.indexOf("_") + 1].toLocaleUpperCase()
                      )
                    : string;
                return x;
              });
              if (self.layerFilterIsActive && self.layerFilter) {
                //response.features = response.features.filter(x=>x.getProperties()[self.layerFilter.key]==[self.layerFilter.value]);
                response.features = response.features.filter(function (x) {
                  return (
                    x.properties[self.layerFilter.key] ==
                      self.layerFilter.value ||
                    self.layerFilter.layers
                      .filter((x) => x.indexOf("existing") >= 0)
                      .indexOf(x.properties.featureType + "s") >= 0
                  );
                });
              }

              self.toFeatureList(response).forEach(function (elem) {
                //elem.set('featureType', layer.get('featureType'));
                iterationObject.lastFeatureCount++;
                selectedFeatures.push(elem);
              });

              resolve();
            },
            function (response) {
              $("body").append(
                '<div id="popup"><div class="content">ინტერნეტთან წვდომა არ არის!</div></div>'
              );

              $("#popup")
                .delay(2000)
                .fadeOut(400, function () {
                  $("#popup").remove();
                });
            }
          );
        });
      };

      var i = 0;

      function f(i) {
        if (i >= visibleLayers.length) {
          self.onSelect.trigger(
            OnClickFeatureGetter.clickCoordinates,
            selectedFeatures
          );
          return;
        }
        var promise = x(visibleLayers[i]);
        if (promise) {
          promise.then(function (data) {
            return f(i + 1);
          });
        } else {
          f(i + 1);
        }
      }

      x(visibleLayers[i]).then(function () {
        return f(i + 1);
      });
    });
  };
  OnClickFeatureGetter.init = function (map, layers) {
    this.map = map;
    this.layers = layers;
    this.onSelect = new Action();
    this.disable();
    this.initInteraction();
  };
  OnClickFeatureGetter.toFeatureList = function (geoJSON) {
    return new ol.format.GeoJSON({
      featureProjection: "EPSG:3857",
    }).readFeatures(geoJSON);
  };
  OnClickFeatureGetter.addCallback = function (thisArg, func) {
    this.onSelect.addCallback(thisArg, func);
  };
  OnClickFeatureGetter.enable = function () {
    this.layerFilterIsActive = true;
    this._enabled = true;
  };
  OnClickFeatureGetter.disable = function () {
    this.layerFilterIsActive = false;
    this._enabled = false;
  };
  OnClickFeatureGetter.enabled = function () {
    return this._enabled;
  };

  OnClickFeatureGetter.setLayerFilter = function (layers) {
    this.layerFilter = layers;
  };
  return OnClickFeatureGetter;
})();
//# sourceMappingURL=OnClickFeatureGetter.js.map
