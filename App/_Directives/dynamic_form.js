(function () {

    var dynamicFormDirective = function(){
        var getInput = function (contentJson, index) {
            template = '';
            switch(contentJson[index].fieldType){
                case 'selectBox':
                    template =
                        '<div><md-input-container>' +
                        '<label>'+contentJson[index].label+'</label>' +
                        '<md-select ng-model="content[index].model">' +
                        '<md-option><em>None</em></md-option>' +
                        '<md-option ng-repeat="rec in content[index].data" ng-value="rec.value">{{rec.title}}</md-option>' +
                        '</md-select>' +
                        '</md-input-container></div>';
                    break;
                case 'textField':
                    template = '<div>' +
                        '<md-input-container flex="50">' +
                        '<label>'+contentJson[index].label+'</label>' +
                        '<input required name="'+contentJson[index].name+'" ng-model="content[index].model">' +
                        '<div ng-messages="projectForm.clientName.$error">' +
                        '<div ng-message="'+contentJson[index].required+'">This is required.</div>' +
                        '</div>' +
                        '</md-input-container></div>';
            }

            return template

        }

        var getTemplate = function(scope){

            var contentJson = scope.content
            var html = '';

            for(var i in contentJson){
                contentJson[i].model = '';
                html += getInput(contentJson, i);
            }
            var formName = "dynamicForm_"+Math.floor(Date.now() / 1000);
            scope.formName = formName
            return '<ng-form name="'+formName+'">'+html+'</ng-form>';
        };

        return {
            restrict: "E",
            replace: true,
            link: function(scope, element, attrs){
                element.html(getTemplate(scope)).show();
                $compile(element.contents())(scope);
            },
            scope: {
                content:'='
            }
        };


    }




    angular.module("datacollection.directives").directive("dynamicForm",dynamicFormDirective);



})();

