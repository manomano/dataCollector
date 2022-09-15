var PointAssignmentDrawer = (function () {
  function PointAssignmentDrawer(map) {
    this.map = map;
    this.source = new ol.source.Vector();
    this.layer = new ol.layer.Vector({
      source: this.source,
      renderOrder: null,
    });
    this.onDrawCompleteCallback = new Action();
    this.initDrawingInteraction();
  }
  PointAssignmentDrawer.prototype.draw = function () {
    this.drawingInteraction.setActive(true);
  };
  PointAssignmentDrawer.prototype.disable = function () {
    this.drawingInteraction.setActive(false);
  };
  PointAssignmentDrawer.prototype.initDrawingInteraction = function () {
    this.drawingInteraction = new ol.interaction.Draw({
      source: this.source,
      type: "Point",
    });
    this.drawingInteraction.setActive(false);
    var self = this;
    this.drawingInteraction.on("drawend", function (event) {
      self.drawingInteraction.setActive(false);
      self.onDrawCompleteCallback.trigger(event.feature);
    });
    this.map.addInteraction(this.drawingInteraction);
  };
  return PointAssignmentDrawer;
})();
//# sourceMappingURL=PointAssigmentDrawer.js.map
