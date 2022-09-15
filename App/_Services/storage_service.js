(function() {

	var storageService = function($window) {


		this.getStorageType = function () {


			if($window.localStorage){
                if($window.localStorage.getItem("dataCollection_accessToken")){
                    return "localStorage";
                }
			}


            return "sessionStorage";

        }


        this.hasProperty = function (prop) {
			return $window[this.getStorageType()].hasOwnProperty(prop)
        }
		this.setvalue = function(key, value) {
            $window[this.getStorageType()].setItem(key, value);
		}

		this.getValue = function(key) {
            return $window[this.getStorageType()].getItem(key);
		}

		this.saveObject = function(key, object) {
			this.setvalue(key, JSON.stringify(object));
		}

		this.getObject = function(key) {
			return JSON.parse(this.getValue(key));
		}

		this.remove = function(key) {
            $window[this.getStorageType()].removeItem(key);
		}

		this.clear = function () {
            $window[this.getStorageType()].clear();
        }
	}
	storageService.$inject = ["$window"];
	angular.module("datacollection.services").service("StorageService", storageService);

})();