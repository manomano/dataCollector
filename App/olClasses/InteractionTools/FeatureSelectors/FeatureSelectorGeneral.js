/**
 * Created by mjaparidze on 9/13/2018.
 */


var FeatureSelectorGeneral = (function () {
    function FeatureSelectorGeneral(map, layers, selectFilter) {

        var vectorLayers = layers.filter(x=>x.type=='VECTOR');
        var _this = this;
        _this.map = map;
        _this.selectFilter = selectFilter;
        _this.initSelectInteraction(vectorLayers);
        _this.disable();
        OnSelectFeatureChooser.addCallback(_this, _this.selectFeature);
        return _this;
    }

    FeatureSelectorGeneral.prototype.initSelectInteraction = function (layers) {
        this.selectionLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            renderOrder: null,
            style: Styles.selectLayerStyleFunction
        });
        this.map.addLayer(this.selectionLayer);

        layers.push(this.selectionLayer);

        this.selectInteraction = this.createSelectInteraction(layers);
        var snap = new ol.interaction.Snap({
            source: this.selectionLayer.getSource()
        });

        var onSelectListener = this.createOnSelectListener();
        this.selectInteraction.on('select', onSelectListener);
        this.enable(true);
        this.selectInteraction.setHitTolerance(10);
        this.map.addInteraction(this.selectInteraction);
        this.map.addInteraction(snap);
    };
    FeatureSelectorGeneral.prototype.createOnSelectListener = function () {
        var self = this;
        return function (event) {
            //self.selectionLayer.getSource().addFeature(...self.getSelectedFeatures());
                  self.getSelectedFeatures().forEach(function (feature) {
                    if (feature.getProperties()['featureType'] !== event.selected[0].getProperties()['featureType']) {
                         //self.clearSelection();
                         console.log('it is selected');
                         event.selected.forEach(function (eventFeature) {
                             if(eventFeature==feature){
                                 //self.selectInteraction.remove
                             }
                            self.selectFeature(eventFeature);
                     });
                    }
             });
        };
    };

    FeatureSelectorGeneral.prototype.createSelectInteraction = function (layers) {
        var me = this;
        return new ol.interaction.Select({
            layers: layers,
            condition: null ,
            toggleCondition: ol.events.condition.singleClick,
            filter: function(feature, layer){
                if(me.selectFilter){
                    return me.selectFilter(feature, layer);
                }else{
                    return true;
                }

            }
        });
    };


    FeatureSelectorGeneral.prototype.addOtherInteractions = function(){
        this.modifyInteraction = this.createModifyInteraction();
        this.dragInteraction = this.createDragInteraction();
        this.map.addInteraction(this.modifyInteraction);
        this.map.addInteraction(this.dragInteraction);
        this.dragInteraction.setActive(false);
        this.modifyInteraction.setActive(false);
    };

    FeatureSelectorGeneral.prototype.createModifyInteraction= function (layers) {
        return  new ol.interaction.Modify({
            features: this.selectInteraction.getFeatures()
        });
    };

    FeatureSelectorGeneral.prototype.createDragInteraction = function () {
        return new ol.interaction.Translate({
            features: this.selectInteraction.getFeatures()
        });
    }



    FeatureSelectorGeneral.prototype.setActive = function (mode) {
        this.selectInteraction.setActive(mode);
        //this.modifyInteraction.setActive(mode);
    };

    FeatureSelectorGeneral.prototype.setActiveByInteractionName = function (interactionKey, mode) {
        this[interactionKey].setActive(mode);
    };


    FeatureSelectorGeneral.prototype.removeSelectedFeature = function () {
        var selectedFeatures = this.getSelectedFeatures();
        var me = this;
        selectedFeatures.forEach(function(feature){
            var source = me.selectInteraction.getLayer(feature).getSource();
            source.removeFeature(feature);

        });
        me.clearSelection();
    }

    FeatureSelectorGeneral.prototype.enableInteraction  = function (interactionName, mode) {
        if(this[interactionName].getActive()==mode){
            return;
        }
        this[interactionName].setActive(mode);
    };

    FeatureSelectorGeneral.prototype.disable = function () {
        this.clearSelection();
        this.setActive(false);
        OnClickFeatureGetter.disable();
    };
    FeatureSelectorGeneral.prototype.enable = function () {
        this.setActive(true);
        OnClickFeatureGetter.enable();
    };
    FeatureSelectorGeneral.prototype.clearSelection = function () {
        this.selectInteraction.getFeatures().clear();
        this.selectionLayer.getSource().clear();
    };
    FeatureSelectorGeneral.prototype.selectFeature = function (feature) {
        var selectedFeatures = this.selectInteraction.getFeatures();
        selectedFeatures.push(feature);
    };
    FeatureSelectorGeneral.prototype.selectFeatures = function (features) {
        var self = this;
        features.forEach(function (feature) {
            self.selectFeature(feature);
        });
    };
    FeatureSelectorGeneral.prototype.getSelectedFeatures = function () {
        return this.selectInteraction.getFeatures().getArray();
    };
    return FeatureSelectorGeneral;
})();