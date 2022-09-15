var UserLocator = (function () {
    function UserLocator(GPSVectorLayerSource) {
        this.TIMER_INTERVAL = 1500; // MILLISECONDS
        this.LOCATION_POINT_FEATURE_NAME = 'userLocationPoint';
        this.GPSVectorLayerSource = GPSVectorLayerSource;
    }
    UserLocator.prototype.startTimer = function () {
        var timerFunction = this.getTimerFunction();
        this.coordinatesGetterTimer = setInterval(timerFunction, this.TIMER_INTERVAL);
    };
    UserLocator.prototype.getTimerFunction = function () {
        var self = this;
        return function () {
            self.removeGPSPoint();
            var location = self.getLocation();
            var transformedLocation = self.transformLocation(location);
            var pointGeometry = new ol.geom.Point(transformedLocation);
            self.userLocationPoint = self.createLocationPointFeature(pointGeometry);
            self.userLocationPoint.setStyle(Styles.userGPSFeatureStyle);
            self.addGPSPoint();
        };
    };
    UserLocator.prototype.getLocation = function () {

        if(typeof (userLocation)!=='undefined') {

            var rawLocation = userLocation.getUserLocation();
            var jsonLocation = JSON.parse(rawLocation);
            var latitude = jsonLocation['latitude'];
            var longitude = jsonLocation['longitude'];
            //return [latitude, longitude];
            return [longitude,latitude];
        }else{
            return [44.807068,41.702568];
        }
    };
    UserLocator.prototype.transformLocation = function (location) {
        return ol.proj.transform(location, 'EPSG:4326', 'EPSG:3857');
    };
    UserLocator.prototype.createLocationPointFeature = function (geometry) {
        return new ol.Feature({
            name: this.LOCATION_POINT_FEATURE_NAME,
            geometry: geometry
        });
    };
    UserLocator.prototype.removeGPSPoint = function () {
        if (!this.userLocationPoint)
            return false;
        this.GPSVectorLayerSource.removeFeature(this.userLocationPoint);
        return true;
    };
    UserLocator.prototype.addGPSPoint = function () {
        this.GPSVectorLayerSource.addFeature(this.userLocationPoint);
    };
    UserLocator.prototype.enable = function () {
        this.startTimer();
    };
    UserLocator.prototype.disable = function () {
        clearInterval(this.coordinatesGetterTimer);
    };
    UserLocator.prototype.getLocationPoint = function () {
        return this.userLocationPoint;
    };
    return UserLocator;
}());
//# sourceMappingURL=UserLocator.js.map