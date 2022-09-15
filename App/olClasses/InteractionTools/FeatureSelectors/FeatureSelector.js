/**
 * Created by kokadva on 6/14/17.
 */
var FeatureSelector = (function () {
  function FeatureSelector() {}
  return FeatureSelector;
})();
//# sourceMappingURL=FeatureSelector.js.map

var featureSelectorFactory = function (map, layers, callback) {
  var isWMS = utils.isWMS();

  if (isWMS || utils.getRole() == "ROLE_ADMIN") {
    return new WMSFeatureSelector(map, callback);
  } else {
    return new WFSFeatureSelector(map, layers, callback);
  }
};
