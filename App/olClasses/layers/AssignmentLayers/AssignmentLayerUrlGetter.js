/**
 * Created by kokadva on 6/15/17.
 */
var AssignmentLayerUrlGetter = (function () {
    function AssignmentLayerUrlGetter() {
    }
    AssignmentLayerUrlGetter.gridsForPOIsWFS = function () {
        return baseUrl.getBaseUrl() + "WFSController/gridsForPoi?token=" + userToken.getUserToken() + "&placeId=" + userInfo.getUserPlaceId();
    };
    AssignmentLayerUrlGetter.roadsForSignsWFS = function () {
        return baseUrl.getBaseUrl() + "WFSController/roadsForSigns?token=" + userToken.getUserToken() + "&placeId=" + userInfo.getUserPlaceId();
    };
    AssignmentLayerUrlGetter.roadsForVeloTracksWFS = function () {
        return baseUrl.getBaseUrl() + "WFSController/roadsForVeloTracks?token=" + userToken.getUserToken() + "&placeId=" + userInfo.getUserPlaceId();
    };
    return AssignmentLayerUrlGetter;
}());
//# sourceMappingURL=AssignmentLayerUrlGetter.js.map