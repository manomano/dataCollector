(function () {
  var FormService = function ($window, $mdDialog, http, StorageService) {
    var role = StorageService.getObject("role");
    var url = role == "ROLE_ADMIN" ? "admin/" : "" + apiURL;
    this.formFields = {
      parcelInfo: url + "form-fields/parcel-form-fields",
      parcelEntranceInfo: url + "form-fields/parcel-entrance-form-fields",
      buildingInfo: url + "form-fields/building-form-fields",
      buildingEntranceInfo: url + "form-fields/building-entrance-form-fields",

      parcels: url + "form-fields/parcel-form-fields",
      parcelEntrances: url + "form-fields/parcel-entrance-form-fields",
      buildings: url + "form-fields/building-form-fields",
      buildingEntrances: url + "form-fields/building-entrance-form-fields",

      pois: url + "form-fields/poi-form-fields",
      busStops: url + "form-fields/bus-stop-form-fields",
      trafficSigns: url + "form-fields/traffic-sign-form-fields",
      parcelMarks: url + "form-fields/parcel-mark-form-fields",
    };

    this.getFormFields = function (stepName) {
      return http.get(this.formFields[stepName]);
    };

    this.allowDataEntrance = function (
      title,
      conf,
      metadata,
      callback,
      existingParcelProperties
    ) {
      return $mdDialog
        .show({
          title: title,
          width: "800px",
          controller: "FormCtrl",
          templateUrl: prefix + "App/views/dynamic_form.html",
          locals: {
            conf: conf,
            metadata: metadata,
            existingParcelProperties: existingParcelProperties,
          },
          targetEvent: event,
          clickOutsideToClose: false,
        })
        .then(
          function (successData) {
            if (callback) {
              callback(successData);
            }
            return successData;
          },
          function (cancelData) {
            if (callback) {
              callback(cancelData);
            }
          }
        );
    };

    this.allowDataEntranceHierarchial = function (
      title,
      stepName,
      metadata,
      callback,
      existingParcelProperties
    ) {
      return $mdDialog
        .show({
          title: title,
          width: "800px",
          controller: "FormHiCtrl",
          templateUrl: prefix + "App/views/dynamic_hi_form.html",
          locals: {
            stepName: stepName,
            metadata: metadata,
            existingParcelProperties: existingParcelProperties,
          },
          targetEvent: event,
          clickOutsideToClose: false,
        })
        .then(
          function (successData) {
            if (callback) {
              callback(successData);
            }
            return successData;
          },
          function (cancelData) {
            if (callback) {
              callback(cancelData);
            }
          }
        );
    };

    this.showData = function (
      title,
      stepName,
      metadata,
      actualChildElementsNum,
      additional_info
    ) {
      return $mdDialog.show({
        title: title,
        width: "800px",
        controller: "infoCtrl",
        templateUrl: prefix + "App/views/info.html",
        locals: {
          stepName: stepName,
          metadata: metadata,
          actualChildElementsNum: actualChildElementsNum,
          additional_info: additional_info,
        },
        targetEvent: event,
        clickOutsideToClose: false,
      });
    };
  };

  FormService.$inject = ["$window", "$mdDialog", "$http", "StorageService"];
  angular.module("datacollection.services").service("FormService", FormService);
})();

(function () {
  var assignmentService = function ($auth, http, $location, StorageService) {
    var role = StorageService.getObject("role");
    var url = role == "ROLE_ADMIN" ? "admin/" : "" + apiURL;

    this.assignUser = function (servicePath, params) {
      return http.post(url + servicePath + "/assignUser", params);
    };

    this.getAllUsers = function (servicePath) {
      return http.get(url + servicePath + "/users");
    };

    this.completeTask = function (servicePath, id) {
      return http.put(url + servicePath + "/complete/" + id);
    };

    this.pauseTask = function (servicePath, id) {
      return http.put(url + servicePath + "/delay/" + id);
    };

    this.checkForErrors = function (servicePath, id) {
      return http.get(url + servicePath + "/" + id + "/errors");
    };
    this.getInfo = function (serviceName, id) {
      return http.get(url + serviceName + "/" + id + "/info");
    };
  };

  assignmentService.$inject = ["$auth", "$http", "$location", "StorageService"];
  angular
    .module("datacollection.services")
    .service("assignmentService", assignmentService);
})();

(function () {
  var roadAssignmentService = function (
    $auth,
    http,
    $location,
    StorageService
  ) {
    var role = StorageService.getObject("role");
    var url = role == "ROLE_ADMIN" ? "admin/" : "" + apiURL;

    this.assignUser = function (params) {
      return http.post(url + "roadAssignments/assignUser", params);
    };

    this.getAllUsers = function () {
      return http.get(url + "roadAssignments/users");
    };

    this.completeTask = function (id) {
      return http.put(url + "roadAssignments/complete/" + id);
    };

    this.pauseTask = function (id) {
      return http.put(url + "roadAssignments/delay/" + id);
    };

    this.checkForErrors = function (id) {
      return http.get(url + "roadAssignments/" + id + "/errors");
    };

    this.setGroupID = function (params) {
      return http.put(url + "roadAssignments/setGroupId/", params);
    };

    this.getInfo = function (id, serviceName) {
      return http.get(
        url + this.getAdminPath() + serviceName + "/" + id + "/info"
      );
    };
  };

  roadAssignmentService.$inject = [
    "$auth",
    "$http",
    "$location",
    "StorageService",
  ];
  angular
    .module("datacollection.services")
    .service("roadAssignmentService", roadAssignmentService);
})();
