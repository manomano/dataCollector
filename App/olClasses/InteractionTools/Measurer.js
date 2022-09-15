var Measurer = (function () {
    function Measurer(map, measurementLayer) {
        this.map = map;
        this.measurementLayer = measurementLayer;
        this.measurementLayerSource = measurementLayer.getSource();
        this.map.addLayer(this.measurementLayer);
        this.enabled = false;
    }
    Measurer.formatLength = function (line) {
        var length;
        length = Math.round(line.getLength() * 100) / 100;
        var output;
        output = (Math.round(length * 100) / 100) + ' ' + 'm';
        return output;
    };
    Measurer.formatArea = function (polygon) {
        var area;
        area = polygon.getArea();
        var output;
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
        return output;
    };
    Measurer.prototype.createMeasureTooltip = function () {
        if (this.measureTooltipElement) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'tooltip tooltip-measure';
        this.measureTooltip = new ol.Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center'
        });
        this.measureTooltip.set("type", "measuring");
        this.map.addOverlay(this.measureTooltip);
    };
    Measurer.prototype.addInteraction = function (interactionType) {
        if (this.enabled)
            return;
        this.enabled = true;
        var self = this;
        var type = (interactionType == 'area' ? 'Polygon' : 'LineString');
        this.draw = new ol.interaction.Draw({
            source: self.measurementLayerSource,
            type: (type),
            style: Styles.measurementLayerStyle
        });
        this.map.addInteraction(this.draw);
        this.createMeasureTooltip();
        var listener;
        this.draw.on('drawstart', function (evt) {
            self.sketch = evt.feature;
            var tooltipCoord = evt.coordinate;
            listener = self.sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = Measurer.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                }
                else if (geom instanceof ol.geom.LineString) {
                    output = Measurer.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                self.measureTooltipElement.innerHTML = output;
                self.measureTooltip.setPosition(tooltipCoord);
            });
        });
        this.draw.on('drawend', function () {
            self.measureTooltipElement.className = 'tooltip tooltip-static';
            self.measureTooltip.setOffset([0, -7]);
            self.sketch = null;
            self.measureTooltipElement = null;
            ol.Observable.unByKey(listener);
            if (self.draw != null)
                self.draw.setActive(false);
            self.enabled = false;
        });
    };
    Measurer.prototype.clearMeasurings = function () {
        this.measurementLayerSource.clear();
        var overlays = this.map.getOverlays();
        var self = this;
        var toDelete = [];
        overlays.forEach(function (elem) {
            if (elem.get("type") == "measuring") {
                toDelete.push(elem);
            }
        });
        for (var index in toDelete) {
            self.map.removeOverlay(toDelete[index]);
        }
    };
    Measurer.prototype.disable = function () {
        if (this.draw != null)
            this.draw.setActive(false);
        this.enabled = false;
        this.clearMeasurings();
    };
    return Measurer;
}());
//# sourceMappingURL=Measurer.js.map