var newObjectCreator = (function () {
  function newObjectCreator() {}
  newObjectCreator.createNewSign = function (json) {
    alert("Creating new Sign");
  };
  newObjectCreator.createNewRoad = function (json) {
    alert("Creating new Road");
  };
  newObjectCreator.createNewBuilding = function (json) {
    alert("Creating new building");
  };
  newObjectCreator.createNewBusStation = function (json) {
    alert("creating new busStation");
  };
  return newObjectCreator;
})();
var userToken = (function () {
  function userToken() {}
  userToken.getUserToken = function () {
    if (!utils.getAuthorization()) {
      return "";
    }

    return "Bearer " + utils.getAuthorization().accessToken;
  };
  return userToken;
})();
/*var userLocation = (function () {
    function userLocation() {
    }
    userLocation.getUserLocation = function () {

        if(location.href.indexOf("localhost")){
            return '{"latitude":44.807068,"longitude": 41.702568}';
        }else{

        }

    };
    return userLocation;
}());
userLocation.x = 0;*/
var tasksForUser = (function () {
  function tasksForUser() {}
  tasksForUser.gridTasks = function (json, placeID) {
    alert("Grid Task Assignments, Place ID :" + placeID);
    alert(json);
  };
  tasksForUser.roadTasks = function (json, placeID) {
    alert("Road Task Assignments, Place ID :" + placeID);
    alert(json);
  };
  tasksForUser.veloTracksTasks = function (json, placeID) {
    alert("VELO task Assignment, Place ID :" + placeID);
    alert(json);
  };
  return tasksForUser;
})();
var objectInfoUpdater = (function () {
  function objectInfoUpdater() {}
  objectInfoUpdater.POIInfoUpdate = function (buildingID) {
    alert("Updating building info: " + buildingID);
    location.reload();
  };
  return objectInfoUpdater;
})();
var objectInfoViewer = (function () {
  function objectInfoViewer() {}
  objectInfoViewer.objectInfoView = function (poiId) {
    alert(poiId);
  };
  return objectInfoViewer;
})();
var baseUrl = (function () {
  function baseUrl() {}
  baseUrl.getBaseUrl = function () {
    return "http://localhost/dataCollection/";
  };
  return baseUrl;
})();
var userInfo = (function () {
  function userInfo() {}
  userInfo.getUserPlaceId = function () {
    return 22;
  };
  userInfo.getUserId = function () {
    return 1;
  };
  return userInfo;
})();
window.parseResponse = window.parseResponse || {};
//# sourceMappingURL=DummyClasses.js.map
