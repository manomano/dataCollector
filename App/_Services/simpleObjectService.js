(function () {
  var service = function ($auth, http, $location, StorageService) {
    this.StorageService = StorageService;
    var url = apiURL;

    this.getNewPlaces = function () {
      return http.get(url + "places/getNewPlaces");
    };

    this.getStatistics = function (params) {
      let additional = "stats?from=" + params.from;
      for (let prop in params) {
        if (prop == "from") {
          continue;
        }
        additional += "&" + prop + "=" + params[prop];
      }
      return http.get(url + /*this.getAdminPath() +*/ additional);
    };

    this.getPhotoIdies = function (objectId) {
      ///photos/{photo_id}
      return http.get(
        url + this.getAdminPath() + "photos/" + objectId + "/object"
      );
    };

    this.delete = function (id, serviceName) {
      return http.delete(url + this.getAdminPath() + serviceName + "/" + id);
    };

    this.router = function (config) {
      if (config.id) {
        return this.edit(
          config.id,
          config.feature,
          config.serviceName.replace("Geometry", "") + "s"
        );
      } else {
        return this.add(
          config.feature,
          config.serviceName.replace("Geometry", "") + "s"
        );
      }
    };

    this.add = function (parameters, serviceName) {
      return http.post(
        url + this.getAdminPath() + serviceName + "/",
        parameters
      );
    };

    this.edit = function (id, parameters, serviceName) {
      return http.put(
        url + this.getAdminPath() + serviceName + "/" + id + "/geometry",
        parameters
      );
    };

    this.metadata = function (id, parameters, serviceName, editing) {
      if (editing) {
        return http.put(
          url + this.getAdminPath() + serviceName + "/" + id + "/metadata",
          parameters
        );
      }

      return http.post(
        url + this.getAdminPath() + serviceName + "/" + id + "/metadata",
        parameters
      );
    };

    this.getMetadata = function (id, serviceName, additional) {
      serviceName =
        serviceName[0].charCodeAt() <= 90
          ? serviceName.toLocaleLowerCase()
          : serviceName;
      return http.get(
        url +
          this.getAdminPath() +
          (additional ? additional : "") +
          serviceName +
          "/" +
          id +
          "/metadata"
      );
    };

    this.getInfo = function (id, serviceName, additional) {
      serviceName =
        serviceName[0].charCodeAt() <= 90
          ? serviceName.toLocaleLowerCase()
          : serviceName;
      return http.get(
        url +
          this.getAdminPath() +
          (additional ? additional : "") +
          serviceName +
          "/" +
          id +
          "/info"
      );
    };

    this.getInfo = function (id, serviceName, additional) {
      serviceName =
        serviceName[0].charCodeAt() <= 90
          ? serviceName.toLocaleLowerCase()
          : serviceName;
      return http.get(
        url +
          this.getAdminPath() +
          (additional ? additional : "") +
          serviceName +
          "/" +
          id +
          "/info"
      );
    };

    this.getError = function (id, serviceName, additional) {
      serviceName =
        serviceName[0].charCodeAt() <= 90
          ? serviceName.toLocaleLowerCase()
          : serviceName;
      return http.get(
        url +
          this.getAdminPath() +
          additional +
          serviceName +
          "/" +
          id +
          "/errors"
      );
    };

    this.markParcelForDelete = function (parameters) {
      return http.post(
        url + this.getAdminPath() + "pebe/parcelMarks/create",
        parameters
      );
    };

    this.getAdminPath = function () {
      return StorageService.getObject("Authorization")["role"] == "ROLE_ADMIN"
        ? "admin/"
        : "";
    };

    this.getObjectCount = function (layerName, params) {
      var urlObject = {
        parcelEntrancesNum: "pebe/parcels/x/parcelEntrancesNum",
        buildingEntrancesNum: "pebe/buildings/x/buildingEntrancesNum",
        buildingsNum: "pebe/parcels/x/buildingsNum",
      };

      return http.get(
        url +
          this.getAdminPath() +
          urlObject[layerName + "Num"].replace("x", params.x + "/")
      );
    };

    this.metadataIsFilled = function (layerName, id) {
      var urlObject = {
        parcelsMetadataIsFilled: "pebe/parcels/x/metadataIsFilled",
        buildingsMetadataIsFilled: "pebe/buildings/x/metadataIsFilled",
      };

      return http.get(
        url +
          this.getAdminPath() +
          urlObject[layerName + "MetadataIsFilled"].replace("x", id + "/")
      );
    };

    this.getFeatures = function (layerName, id) {
      var urlObject = {
        parcels: "pebe/parcels/x/",
        parcelEntrances: "pebe/parcels/x/parcelEntrances/",
        buildings: "pebe/parcels/x/buildings/",

        buildingEntrances: "pebe/buildings/x/buildingEntrances/",

        existingParcels: "pebe/existingParcels/x/",
        existingBuildings: "pebe/existingBuildings/x/",

        pois: "pois/x/",
        trafficSigns: "trafficSigns/x/",
        busStops: "busStops/x/",
        assignments: "assignments/x/assignment",
      };

      return http.get(
        url + this.getAdminPath() + urlObject[layerName].replace("x/", id + "/")
      );
    };
  };

  service.$inject = ["$auth", "$http", "$location", "StorageService"];
  angular
    .module("datacollection.services")
    .service("simpleObjectService", service);
})();
