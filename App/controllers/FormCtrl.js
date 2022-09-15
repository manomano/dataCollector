(function () {
  var formController = function (
    $sce,
    $scope,
    $timeout,
    MessagingService,
    StorageService,
    $mdDialog,
    FormService,
    ParcelService,
    conf,
    metadata,
    existingParcelProperties
  ) {
    var self = this;
    $scope.generalForm = {};
    $scope.conf = conf;

    $scope.existingParcelPropertiesObject = null;
    $scope.existingParcelPropertiesObject = existingParcelProperties;
    $scope.existingParcelProperties = [];
    $scope.treeIdies = [];
    $scope.fields = [];
    $scope.metadata = metadata;

    $scope.category_change = function (selectedValue, index, field) {
      if (
        $scope.fields[index + 1] &&
        $scope.fields[index + 1].field_id == $scope.fields[index].field_id
      ) {
        $scope.fields[index + 1].items = $scope.categories[selectedValue];
        /* if ($scope.fields[index + 1].items && $scope.fields[index + 1].items.length == 1) {
                    $scope.fields[index + 1].model = $scope.fields[index + 1].items[0].id;
                }*/
      }
      $scope.treeIdies[index] = selectedValue;
      var nextIndex = index + 2;
      while (
        $scope.fields[nextIndex] &&
        $scope.fields[index].field_id == $scope.fields[nextIndex].field_id
      ) {
        $scope.fields[nextIndex].items = [];
        $scope.fields[nextIndex].model = "";
        nextIndex++;
      }
    };

    $scope.traverseItems = function (items, parentObject) {
      $scope.categories = {};
      $scope.levels = {};

      var maxLevel = -2;

      for (var i = 0; i < items.length; i++) {
        if (items[i].fields) {
          items[i].fields.map(function (x) {
            return $scope.addModelField(x, items[i].id);
          });
          $scope.fields.push(...items[i].fields);
        }
        if (typeof $scope.categories[items[i].parentId] == "undefined") {
          $scope.categories[items[i].parentId] = [];
        }
        $scope.categories[items[i].parentId].push(items[i]);

        if (items[i].parentId == -1) {
          $scope.levels[items[i].id] = 1;
        } else {
          $scope.levels[items[i].id] = $scope.levels[items[i].parentId] + 1;
        }

        if (maxLevel < $scope.levels[items[i].id]) {
          maxLevel = $scope.levels[items[i].id];
        }
      }

      if ($scope.metadata) {
        if ($scope.metadata[parentObject.id]) {
          var foundLastCatgeory = items.find(function (x) {
            return x.id == $scope.metadata[parentObject.id];
          });
          var idSearched = foundLastCatgeory.parentId;
          var selectedCategories = [];

          selectedCategories.push({
            parentId: foundLastCatgeory.parentId,
            id: $scope.metadata[parentObject.id],
          });
          var rec;
          while (
            (rec = items.find(function (x) {
              return x.id == idSearched;
            }))
          ) {
            idSearched = rec.parentId;
            selectedCategories.push({ parentId: rec.parentId, id: rec.id });
          }

          selectedCategories.reverse();
        }
      }

      for (i = 0; i < maxLevel; i++) {
        var selectObj = Object.assign({}, parentObject);
        if (selectedCategories && selectedCategories[i]) {
          $scope.treeIdies[i] = selectedCategories[i].id;
          selectObj.items = $scope.categories[selectedCategories[i].parentId];
          selectObj.model = selectedCategories[i].id;
        } else {
          selectObj.model = "";
        }

        selectObj.required = 2;
        if (i == 0 && !selectedCategories) {
          selectObj.items = $scope.categories[-1];
        }
        var labelArr = selectObj.label.split(" ");
        labelArr[1] =
          (i > 0 ? "ქვე" : "") + labelArr[1] + " " + (i > 0 ? i : "");
        selectObj.label = labelArr.join(" ");

        selectObj.field_id = selectObj.id;
        $scope.fields.splice(i, 0, selectObj);
      }

      $scope.selectBoxCount = maxLevel;
    };

    $scope.change = function (field) {
      field.unidentified = !!!field.unidentified;
    };

    $scope.addModelField = function (field, parentId) {
      field.model = field.type == "NUMBER_FIELD" ? 0 : "";
      if (parentId) {
        field.parentId = parentId;
      }

      if (field.type == "TIME_FIELDS") {
        field.times = {};
        field.times.from = "";
        field.times.to = "";
      }

      if (field.type == "REPEATABLE_TEXT_FIELD") {
        field.unidentified = false;
        field.checked = false;
        field.model = [];
      }

      if ($scope.existingParcelPropertiesObject) {
        field.model = $scope.existingParcelPropertiesObject[field.id]
          ? field.type == "NUMBER_FIELD"
            ? parseFloat($scope.existingParcelPropertiesObject[field.id])
            : $scope.existingParcelPropertiesObject[field.id]
          : "";

        if (field.type == "REPEATABLE_TEXT_FIELD") {
          if ($scope.existingParcelPropertiesObject[field.id]) {
            field.model = $scope.existingParcelPropertiesObject[field.id]
              .split("|")
              .map((x) => (x = { OWNER: x }));
          }
        }
      }

      if ($scope.metadata) {
        if (field.type == "TIME_FIELDS") {
          field.times.from = "";
          field.times.to = "";
          if ($scope.metadata[field.id]) {
            var timeArr = $scope.metadata[field.id].split("-");
            if (timeArr) {
              field.times.from = new Date(
                new Date().getUTCFullYear(),
                new Date().getMonth(),
                new Date().getDay(),
                parseInt(timeArr[0].split(":")[0]),
                parseInt(timeArr[0].split(":")[1])
              );
              if (timeArr[1]) {
                field.times.to = new Date(
                  new Date().getUTCFullYear(),
                  new Date().getMonth(),
                  new Date().getDay(),
                  parseInt(timeArr[1].split(":")[0]),
                  parseInt(timeArr[1].split(":")[1])
                );
              }
            }
          }
        }

        field.model =
          field.type == "NUMBER_FIELD"
            ? parseFloat($scope.metadata[field.id])
            : $scope.metadata[field.id];

        if (field.type == "REPEATABLE_TEXT_FIELD") {
          if (
            $scope.metadata[field.id] == "დაუდგენელი" ||
            !$scope.metadata[field.id]
          ) {
            field.unidentified = true;
            field.checked = true;
            field.model = [];
          } else {
            field.model = $scope.metadata[field.id]
              .split("|")
              .map((x) => (x = { OWNER: x }));
          }
        }
      }
    };

    $scope.traverseTree = function (tree) {
      var branch = tree[0].children;
      var textareas = [];
      for (var i in branch) {
        if (!branch[i].fields) {
          if (branch[i].type !== "CATEGORY_SELECT_FIELD") {
            $scope.addModelField(branch[i]);
            if (branch[i].type !== "TEXTAREA_FIELD") {
              $scope.fields.push(branch[i]);
            } else {
              textareas.push(branch[i]);
            }
          } else {
            var parentSelectBoxObject = Object.assign({}, branch[i]);
            delete parentSelectBoxObject.items;
            $scope.traverseItems(branch[i].items, parentSelectBoxObject);
          }
        }
      }

      $scope.fields.push(...textareas);
    };

    $scope.showHide = function (field) {
      return (
        !field.hasOwnProperty("parentId") ||
        $scope.treeIdies.indexOf(field.parentId) >= 0
      );
    };

    $scope.treeOnChange = function (ev) {
      //console.log(ev)
    };

    $scope.changeItem = function (value) {
      $scope.selectedItem = value;
    };

    $scope.formatPrefixZero = function (str) {
      if (parseInt(str)) {
        if (parseInt(str) < 10) {
          return "0" + str;
        }
      }

      return str;
    };

    $scope.save = function (valid) {
      $scope.isSubmited = true;
      if (
        $scope.fields.filter(
          (x) =>
            (x.required == 3 && !x.model) ||
            (x.required == 2 && !x.model && x.type !== "NUMBER_FIELD") ||
            (x.required == 2 &&
              !(parseInt(x.model) + 1) &&
              x.type == "NUMBER_FIELD")
        ).length > 0 ||
        !valid
      ) {
        //$scope.generalForm.submitted = true;
        $scope.isSubmited = false;
        return;
      }

      var mandatory_fields = [];
      $scope.parameters = {};
      for (var i in $scope.fields) {
        $scope.parameters[$scope.fields[i].name] = $scope.fields[i].model;
        if ($scope.fields[i].type == "CATEGORY_SELECT_FIELD") {
          if (
            typeof $scope.fields[i].items == "undefined" ||
            $scope.fields[i].items.length == 0
          ) {
            continue;
          }
          $scope.parameters[$scope.fields[i].field_id] = $scope.fields[i].model;
        } else {
          if (!$scope.fields[i].model && !$scope.fields[i].required == 2) {
            continue;
          }

          if ($scope.fields[i].required == 2 && !$scope.fields[i].model) {
            mandatory_fields.push($scope.fields[i]);
          }
          if (
            typeof $scope.fields[i].parentId == "undefined" ||
            $scope.treeIdies.indexOf($scope.fields[i].parentId) >= 0
          ) {
            if ($scope.fields[i].type == "TIME_FIELDS") {
              //var dada = $filter('date')($scope.fields[i].times.from , "HH:mm", '+0400');
              var from = "";
              var to = "";
              if ($scope.fields[i].times.from) {
                from =
                  $scope.formatPrefixZero(
                    $scope.fields[i].times.from.getHours()
                  ) +
                  ":" +
                  $scope.formatPrefixZero(
                    $scope.fields[i].times.from.getMinutes()
                  );
              }

              if ($scope.fields[i].times.to) {
                to =
                  $scope.formatPrefixZero(
                    $scope.fields[i].times.to.getHours()
                  ) +
                  ":" +
                  $scope.formatPrefixZero(
                    $scope.fields[i].times.to.getMinutes()
                  );
              }

              $scope.fields[i].model = from + (from || to ? "-" : "") + to;
            }
            $scope.parameters[$scope.fields[i].id] =
              $scope.fields[i].model == null ? "" : $scope.fields[i].model;
          }

          if ($scope.fields[i].type == "REPEATABLE_TEXT_FIELD") {
            $scope.parameters[$scope.fields[i].id] = $scope.fields[i]
              .unidentified
              ? "დაუდგენელი"
              : $scope.fields[i].model.map((x) => (x = x["OWNER"])).join("|");
          }
        }
      }

      $scope.parameters.editing = false;
      $scope.parameters.id = $scope.conf.id;
      if ($scope.metadata) {
        $scope.parameters.editing = true;
        if ($scope.metadata.id) {
          $scope.parameters.id = $scope.metadata.id;
        }
      }

      StorageService.setvalue(
        "selectBoxCount",
        JSON.stringify($scope.selectBoxCount)
      );
      if (["busStops", "trafficSigns"].indexOf($scope.conf.stepName) < 0) {
        ParcelService.router(
          $scope.parameters.editing,
          $scope.conf.stepName,
          $scope.parameters
        ).then(
          function () {
            $mdDialog.hide($scope.parameters);
          },
          function (response) {
            MessagingService.displayError("დაფიქსირდა პრობლემა");

            $timeout(function () {
              $scope.isSubmited = false;
            }, 1000);
          }
        );
      } else {
        $mdDialog.hide($scope.parameters);
      }
    };

    $scope.cancel = function () {
      $mdDialog.cancel($scope.parameters);
    };

    if (StorageService.getValue($scope.conf.stepName)) {
      $scope.tree = JSON.parse(StorageService.getValue($scope.conf.stepName));
      $scope.traverseTree($scope.tree, null);
      StorageService.setvalue(
        $scope.conf.stepName,
        JSON.stringify($scope.tree)
      );
    } else {
      FormService.getFormFields($scope.conf.stepName).then(function (response) {
        $scope.tree = response.data;
        $scope.traverseTree($scope.tree, null);
        StorageService.setvalue(
          $scope.conf.stepName,
          JSON.stringify($scope.tree)
        );
      });
    }
  };

  formController.$inject = [
    "$sce",
    "$scope",
    "$timeout",
    "MessagingService",
    "StorageService",
    "$mdDialog",
    "FormService",
    "ParcelService",
    "conf",
    "metadata",
    "existingParcelProperties",
  ];
  angular
    .module("datacollection.mypanel")
    .controller("FormCtrl", formController);
})();
