var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function (d, b) {
            extendStatics(d, b);
            function __() {
                this.constructor = d;
            }

            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
/**
 * Created by kokadva on 6/14/17.
 */
var WFSFeatureSelector = (function (_super) {
    __extends(WFSFeatureSelector, _super);
    function WFSFeatureSelector(map, layers, selectFilter) {

        var vectorLayers = layers.filter(x => x.type == 'VECTOR' || x instanceof ol.layer.Vector);
        var _this = _super.call(this) || this;
        _this.map = map;
        _this.selectFilter = selectFilter;
        _this.initSelectInteraction(vectorLayers);
        _this.disable();
        return _this;
    }

    WFSFeatureSelector.prototype.initSelectInteraction = function (layers) {

        var layerForSnap = layers.filter(x => x.get('name') == 'forDrawing' || x.get('name') == 'selectionLayer')[0];


        this.selectInteraction = this.createSelectInteraction(layers);

        if (layerForSnap) {
            this.snapInteraction = new ol.interaction.Snap({
                source: layerForSnap.getSource()
            });
        }

        var onSelectListener = this.createOnSelectListener();
        this.selectInteraction.on('select', onSelectListener);
        this.enable(true);
        this.selectInteraction.setHitTolerance(20);
        this.map.addInteraction(this.selectInteraction);


    };

    WFSFeatureSelector.prototype.addFeatureToSnap = function (feature) {
        if (this.snapInteraction) {
            this.snapInteraction.addFeature(feature);
        }

    }

    WFSFeatureSelector.prototype.createOnSelectListener = function () {
        var self = this;
        return function (event) {
            //self.listenerObject.setSelectedFeaturesCount (event.selected.length);

            /*      self.getSelectedFeatures().forEach(function (feature) {
             if (feature.getProperties()['featureType'] != event.selected[0].getProperties()['featureType']) {
             self.clearSelection();
             console.log('it is selected');
             event.selected.forEach(function (feature) {
             self.selectFeature(feature);
             });
             }
             });*/
        };
    };
    WFSFeatureSelector.prototype.createSelectInteraction = function (layers) {
        var me = this;
        return new ol.interaction.Select({
            layers: layers,
            condition: null,
            style:new ol.style.Style({

                stroke: new ol.style.Stroke({
                    color: '#0099FF',
                    width: 2
                }),
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: '#0099FF'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#0099FF',
                        width: 3
                    }),
                    radius: 5
                }),
            }),
            toggleCondition: ol.events.condition.singleClick,
            filter: function (feature, layer) {
                if (me.selectFilter) {
                    return me.selectFilter(feature, layer);
                } else {
                    return true;
                }

            }
        });
    };


    WFSFeatureSelector.prototype.addOtherInteractions = function () {
        this.modifyInteraction = this.createModifyInteraction();
        this.dragInteraction = this.createDragInteraction();

        this.map.addInteraction(this.modifyInteraction);
        this.map.addInteraction(this.dragInteraction);
        if (this.snapInteraction) {
            this.map.addInteraction(this.snapInteraction);
        }
        this.dragInteraction.setActive(false);
        this.modifyInteraction.setActive(false);
        this.snapInteraction.setActive(true);
    };

    WFSFeatureSelector.prototype.createModifyInteraction = function (layers) {
        return new ol.interaction.Modify({
            features: this.selectInteraction.getFeatures()
        });
    };

    WFSFeatureSelector.prototype.createDragInteraction = function () {
        return new ol.interaction.Translate({
            features: this.selectInteraction.getFeatures()
        });
    }


    WFSFeatureSelector.prototype.setActive = function (mode) {
        this.selectInteraction.setActive(mode);
        //this.modifyInteraction.setActive(mode);
    };

    WFSFeatureSelector.prototype.setActiveByInteractionName = function (interactionKey, mode) {
        this[interactionKey].setActive(mode);
    };


    WFSFeatureSelector.prototype.removeSelectedFeature = function () {
        var selectedFeatures = this.getSelectedFeatures();
        var me = this;
        selectedFeatures.forEach(function (feature) {
            var source = me.selectInteraction.getLayer(feature).getSource();
            source.removeFeature(feature);

        });
        me.clearSelection();
    }

    WFSFeatureSelector.prototype.enableInteraction = function (interactionName, mode) {
        if (this[interactionName].getActive() == mode) {
            return;
        }
        this[interactionName].setActive(mode);
    };

    WFSFeatureSelector.prototype.disable = function () {
        this.clearSelection();
        this.setActive(false);
    };
    WFSFeatureSelector.prototype.enable = function () {
        this.setActive(true);
    };
    WFSFeatureSelector.prototype.clearSelection = function () {
        this.selectInteraction.getFeatures().clear();
    };
    WFSFeatureSelector.prototype.selectFeature = function (feature) {
        var selectedFeatures = this.selectInteraction.getFeatures();
        selectedFeatures.push(feature);
    };
    WFSFeatureSelector.prototype.selectFeatures = function (features) {
        var self = this;
        features.forEach(function (feature) {
            self.selectFeature(feature);
        });
    };
    WFSFeatureSelector.prototype.getSelectedFeatures = function () {
        return this.selectInteraction.getFeatures().getArray();
    };
    return WFSFeatureSelector;
}(FeatureSelector));
//# sourceMappingURL=WFSFeatureSelector.js.map