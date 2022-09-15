


var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Collection = ol.Collection;
var WMSFeatureSelector = (function (_super) {
    __extends(WMSFeatureSelector, _super);
    function WMSFeatureSelector(map, layerFilter) {
        var _this = _super.call(this) || this;
        _this.setActive(false);
        _this.map = map;
        _this.initSelectionLayer();
        OnClickFeatureGetter.setLayerFilter(layerFilter)
        //OnSelectFeatureChooser.addCallback(_this, _this.selectFeature);
        OnSelectFeatureChooser.addCallback(_this, _this.selectFeatures);
        return _this;
    }
    WMSFeatureSelector.prototype.initSelectionLayer = function () {
        this.selectionLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            renderOrder: null,
            style: Styles.selectLayerStyleFunction,
            name:'selectionLayer'
        });
        this.map.addLayer(this.selectionLayer);
    };
    WMSFeatureSelector.prototype.setActive = function (mode) {
        this.isActive = mode;
    };
    WMSFeatureSelector.prototype.disable = function () {
        //delete selection layer ?
        this.clearSelection();
        this.setActive(false);
        OnClickFeatureGetter.disable();
    };
    WMSFeatureSelector.prototype.enable = function () {
        this.setActive(true);
        OnClickFeatureGetter.enable();
    };
    WMSFeatureSelector.prototype.clearSelection = function () {
        this.selectionLayer.getSource().clear();
    };
    WMSFeatureSelector.prototype.selectFeatures = function (features) {
        var _this = this;
        //features.forEach(function (f) { return _this.selectFeature(f); });

        for(var i = 0; i < features.length; i++){
            _this.selectFeature(features[i]);
        }
    };

    WMSFeatureSelector.prototype.selectFeature = function (feature) {
        var _this = this;
        console.log("movida");
        if (!this.isActive)
            return;
        var sameFeatures = this.getSelectedFeatures().filter(function (f) {
            return utils.getFeatureDescription(f) == utils.getFeatureDescription(feature);
        });
        if (sameFeatures.length > 0) {
            sameFeatures.forEach(function (f) { return _this.selectionLayer.getSource().removeFeature(f); });
        }else {
           /* if (this.getSelectedFeatures().filter(function (f) { return f.get('featureType') != feature.get('featureType'); }).length > 0) {
                this.clearSelection();
            }*/
            this.selectionLayer.getSource().addFeature(feature);
        }


    };
    WMSFeatureSelector.prototype.getSelectedFeatures = function () {
        return this.selectionLayer.getSource().getFeatures();
    };
    return WMSFeatureSelector;
}(FeatureSelector));
//# sourceMappingURL=WMSFeatureSelector.js.map