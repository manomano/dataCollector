/**
 * Created by kokadva on 5/24/17.
 */
var OnSelectFeatureChooser = (function () {
    function OnSelectFeatureChooser() {
    }
    OnSelectFeatureChooser.choose = function (clickCoordinates, features) {

        this.features = features;
        if (this.features.length == 0)
            return;
        this.coordinates = clickCoordinates;
        if (this.features.length >0) {
            this.notify(utils.getFeatureDescription(this.features[this.features.length-1]));
            return;
        }
        //this.popUpList(clickCoordinates, this.features);
    };
    OnSelectFeatureChooser.popUpList = function (clickCoordinates, features) {
        var resultHTML = '<div id="map-marker" style="height: auto;"><div class="map-num">';
        features.forEach(function (x) {
            resultHTML += function (f) {

                return " <a onclick=" + '"' + "OnSelectFeatureChooser.notify('" + utils.getFeatureDescription(f) + "'" + ")" + '"' + ">" + utils.getFeatureDescription(f) + "</a> </br></br>";
            }(x);
        });
        resultHTML += '</div></div>';
    };
    OnSelectFeatureChooser.notify = function (description) {

       /* var selected = this.features.filter(function (feature) { return utils.getFeatureDescription(feature) == description; })[0];
        this.onFeatureSelect.trigger(selected, this.coordinates);*/
        var coordinates = this.coordinates;
        //this.features.map(selected=>this.onFeatureSelect.trigger(selected, coordinates));
        this.onFeatureSelect.trigger(this.features, this.coordinates);

    };
    OnSelectFeatureChooser.addCallback = function (thisArg, func) {
        this.onFeatureSelect.addCallback(thisArg, func);
    };
    return OnSelectFeatureChooser;
}());
OnSelectFeatureChooser.onFeatureSelect = new Action();
OnSelectFeatureChooser.features = null;
//# sourceMappingURL=OnSelectFeatureChooser.js.map