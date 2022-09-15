(function() {

    var ParcelService = function($auth, http, $location,StorageService) {
        var url = apiURL;

		this.getAdminPath = function () {
            return StorageService.getObject('Authorization')?(StorageService.getObject('Authorization')['role']=='ROLE_ADMIN'?'admin/':''):'';
        }
		
        this.PARCEL_HTTP = {
            parcel:         url +'parcels',
            parcelEntrances: url +'parcelEntrances'
        };

        this.PARCEL_CREATE  = {
            generalURL:url+'pebe/parcels/',
            parcelGeometry:url+this.getAdminPath()+'pebe/parcels',
            parcelInfo:url+this.getAdminPath()+'pebe/parcels/x/metadata',
            parcelEntranceGeometry:url+this.getAdminPath()+'pebe/parcels/x/parcelEntrances',
            parcelEntranceInfo:url+this.getAdminPath()+'pebe/parcelEntrances/x/metadata',
            buildingGeometry:url+this.getAdminPath()+'pebe/parcels/x/buildings',
            buildingInfo:url+this.getAdminPath()+'pebe/buildings/x/metadata',
            buildingEntranceGeometry:url+this.getAdminPath()+'pebe/buildings/x/buildingEntrances',
            buildingEntranceInfo:url+this.getAdminPath()+'pebe/buildingEntrances/x/metadata'
        };


        this.PARCEL_EDIT = {
            parcelGeometry:url+this.getAdminPath()+"pebe/parcels/x/geometry",
            parcelInfo: url+this.getAdminPath()+ "pebe/parcels/x/metadata",
            parcelEntranceGeometry:url+this.getAdminPath()+"pebe/parcelEntrances/x/geometry",
            parcelEntranceInfo:url+this.getAdminPath()+"pebe/parcelEntrances/x/metadata",
            buildingGeometry:url+this.getAdminPath()+"pebe/buildings/x/geometry",
            buildingInfo:url+this.getAdminPath()+"pebe/buildings/x/metadata",
            buildingEntranceGeometry:url+this.getAdminPath()+"pebe/buildingEntrances/x/geometry",
            buildingEntranceInfo:url+this.getAdminPath()+"pebe/buildingEntrances/x/metadata"
        }

        this.formFields = {
            parcelInfo: url+'form-fields/parcel-form-fields',
            parcelEntranceInfo:url + 'form-fields/parcel-entrance-form-fields',
            buildingInfo:url +'form-fields/building-form-fields',
            buildingEntranceInfo:url +"form-fields/building-entrance-form-fields"
        }


       this.getFormFields = function (stepName) {
           return http.get(this.formFields[stepName])
       }


        this.getMetadata = function (stepName,param) {
            return http.get(this.PARCEL_EDIT[stepName].replace('x', param))
        }

       this.router = function (editing, stepName, parameters) {

           var url = "";
           //var id = parameters.properties ?parameters.properties.ID:parameters.id;
           var id = parameters.id?parameters.id:parameters.properties?parameters.properties.ID:"";

           var parametersToPass = {};
           if(parameters.hasOwnProperty('properties')){
               parametersToPass = parameters.geometry
           }else{
               Object.keys(parameters).forEach(function(key,index) {
                   if(parseInt(key)){
                       parametersToPass[key] = parameters[key]
                   }
               });
           }

           url = this.PARCEL_CREATE[stepName].replace('x', id)
           if(editing){
               url = this.PARCEL_EDIT[stepName].replace('x', id)
               return http.put(url,parametersToPass);
           }

           return http.post(url,parametersToPass);

       }

       this.delete_parcel = function (id) {
           return http.delete(url+this.getAdminPath()+"pebe/parcels/"+id);
       }

        this.delete_parcelEntrance = function (id) {
            return http.delete(url+this.getAdminPath()+"pebe/parcelEntrances/"+id);
        }


        this.delete_buildingEntrance = function (id) {
            return http.delete(url+this.getAdminPath()+"pebe/buildingEntrances/"+id);
        }

        this.delete_building = function (id) {
            return http.delete(url+this.getAdminPath()+"pebe/buildings/"+id);
        }

    }


    ParcelService.$inject = ["$auth", "$http", "$location","StorageService"];
    angular.module("datacollection.services").service("ParcelService", ParcelService);

})();
