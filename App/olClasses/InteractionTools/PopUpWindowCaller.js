/**
 * Created by kokadva on 5/24/17.
 */
var PopUpWindowCaller = (function () {
    function PopUpWindowCaller() {
    }
    PopUpWindowCaller.init = function (map) {
        PopUpWindowCaller.map = map;
        this.initOverlay();
    };
    PopUpWindowCaller.initOverlay = function () {
        PopUpWindowCaller.popup = this.createOverlay();
        PopUpWindowCaller.map.addOverlay(PopUpWindowCaller.popup);
    };
    PopUpWindowCaller.createOverlay = function () {
        return new ol.Overlay({
            element: document.getElementById(PopUpWindowCaller.INFO_WINDOW_ID)
        });
    };
    PopUpWindowCaller.showPopUp = function (coordinates, content) {
        var element = PopUpWindowCaller.popup.getElement();
        $(element).popover('destroy');
        PopUpWindowCaller.popup.setPosition(coordinates);
        $(element).popover({
            'placement': 'bottom',
            'animation': false,
            'html': true,
            'content': content
        });
        $(element).popover('show');
    };
    PopUpWindowCaller.closePopUp = function () {
        var element = PopUpWindowCaller.popup.getElement();
        $(element).popover('destroy');
    };
    return PopUpWindowCaller;
}());
PopUpWindowCaller.INFO_WINDOW_ID = 'popup_window';
//# sourceMappingURL=PopUpWindowCaller.js.map