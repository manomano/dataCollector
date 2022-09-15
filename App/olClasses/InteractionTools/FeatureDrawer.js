var DrawingState = {
    DRAWING: 0,
    REDRAWING: 1,
    DISABLED: 2
};
var FeatureDrawer = (function () {
    function FeatureDrawer(map, drawingLayer) {
        this.map = map;
        this.featureDrawingLayer = drawingLayer;
        this.initDrawingLayer();
        this.initDrawingInteractions();
        this.onRedrawnAction = new Action();
        this.onDrawnAction = new Action();
        this.state = DrawingState.DISABLED;

    }


    FeatureDrawer.prototype.initDrawingLayer = function () {
        this.map.addLayer(this.featureDrawingLayer);
    };

    FeatureDrawer.prototype.initDrawingInteractions = function () {

        var conditionNoModifierKeysWithin = function(mapBrowserEvent) {
            // Spatial constraints
            if(!LayerUtils.ongoingAssignment){
                return false;
            }

            var drawWithin = LayerUtils.ongoingAssignment.intersectsCoordinate(mapBrowserEvent.coordinate);


            var originalEvent = mapBrowserEvent.originalEvent;
            // condition combining keyboard keys & the spatial contraints
            return (
            !originalEvent.altKey &&
            !(originalEvent.metaKey || originalEvent.ctrlKey) &&
            !originalEvent.shiftKey &&
            drawWithin);
        };



        this.drawingInteractions = {
            'Point': new ol.interaction.Draw({
                source: this.featureDrawingLayer.getSource(),
                type: 'Point'
            }),
            'Polygon': new ol.interaction.Draw({
                source: this.featureDrawingLayer.getSource(),
                //condition:conditionNoModifierKeysWithin,
                type: 'Polygon'
            }),
            'LineString': new ol.interaction.Draw({
                source: this.featureDrawingLayer.getSource(),
                type: 'LineString',
                maxPoints: 2,

            }),
            'Road': new ol.interaction.Draw({
                source: this.featureDrawingLayer.getSource(),
                type: 'LineString'
            })
        };
        var self = this;
        for (var interactionName in this.drawingInteractions) {
            (function (itName) {

                var interaction = (self.drawingInteractions[itName]);
                interaction.setActive(false);
                interaction.on('drawend', function (event) {

                    var properties;

                    event.target.setActive(false);
                    if (self.state == DrawingState.DRAWING) {
                        self.onDrawnAction.trigger(self.drawingObjectName, event.feature);
                    }
                    if (self.state == DrawingState.REDRAWING) {
                        self.onRedrawnAction.trigger(event.feature);
                    }
                    self.state = DrawingState.DISABLED;
                });


                self.map.addInteraction(interaction);
            })(interactionName);
        }
    };
    FeatureDrawer.prototype.redrawFeature = function (feature) {
        var featureTypeName = feature.get("featureType");
        this.startDrawing(featureTypeName);
        this.drawingObjectName = featureTypeName;
        this.state = DrawingState.REDRAWING;
    };
    FeatureDrawer.prototype.startDrawing = function (objectNameType) {
        this.drawingObjectName = objectNameType;
        this.drawingInteractions[utils.featureNameTypeMap[objectNameType]].setActive(true);
        this.state = DrawingState.DRAWING;
    };
    FeatureDrawer.prototype.disable = function () {
        this.state = DrawingState.DISABLED;
        for (var interactionName in this.drawingInteractions) {
            this.drawingInteractions[interactionName].setActive(false);
        }
    };

    return FeatureDrawer;
}());
//# sourceMappingURL=FeatureDrawer.js.map