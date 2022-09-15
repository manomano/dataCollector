var Action = (function () {
    function Action() {
        this.functions = [];
    }
    Action.prototype.addCallback = function (thisArg, func) {
        this.functions.push([thisArg, func]);
        return this;
    };
    Action.prototype.trigger = function () {
        var parameters = [];
        for (var x = 0; x < arguments.length; x++) {
            parameters.push(arguments[x]);
        }
        this.functions.forEach(function (callback) {
            callback[1].apply(callback[0], parameters);
        });
    };

    Action.prototype.triggerOne = function () {
        var parameters = [];
        var obj = arguments[0];
        for (var x = 1; x < arguments.length; x++) {
            parameters.push(arguments[x]);
        }
        var index = this.functions.findIndex(function(el){
            el[0]==obj;
        });

        if(index > -1) {
            this.functions[index][1].apply(this.functions[index][0], parameters);;
        }

    };


    return Action;
}());
