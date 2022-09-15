(function () {
  var formController = function (
    $sce,
    $scope,
    MessagingService,
    StorageService,
    $mdDialog,
    FormService,
    stepName,
    metadata,
    existingParcelProperties
  ) {
    var self = this;
    $scope.treeIdies = [];
    $scope.fields = [];
    $scope.metadata = metadata;

    $scope.category_change = function (selectedValue, index, field) {
      var isChanged = false;
      if ($scope.treeIdies[index] !== selectedValue) {
        isChanged = true;
      }

      $scope.treeIdies[index] = parseInt(selectedValue);
      if (isChanged) {
        $scope.treeIdies.splice(index + 1, $scope.treeIdies.length);
      }

      $scope.fields = $scope.fields.filter(
        (x) =>
          $scope.treeIdies.indexOf(x.parentId) >= 0 ||
          x.parentId == -1 ||
          !x.parentId
      );

      var items = $scope.tree[0].children[0].items;
      var branch = items.find((x) => x.id == $scope.treeIdies[0]);

      function fill(br) {
        if (!br) {
          return;
        }
        var branch = JSON.parse(JSON.stringify(br));
        branch.children.map(function (x) {
          delete x.fields;
          delete x.children;
        });
        var o = {
          label: branch.geoName + " - ქვეკატეგორია",
          geoName: branch.geoName,
          id: branch.id,
          parentId: branch.id,
          items: branch.children,
          field_id: branch.field_id,
          type: "CATEGORY_SELECT_FIELD",
        };
        if (branch.children.length) {
          $scope.fields.splice(index + 1, 0, o);
        }

        //branch.fields.map(x=>x.parentId=branch.id);
        branch.fields.map((x) => $scope.addModelField(x, branch.id));
        $scope.fields.push(...branch.fields);
      }

      if ($scope.treeIdies.length == 1) {
        fill(branch);
        replaceTextAreaAtLastIndex();
        return;
      }

      var k = 1;
      while ($scope.treeIdies[k]) {
        branch = JSON.parse(
          JSON.stringify(
            branch.children.find((x) => x.id == $scope.treeIdies[k])
          )
        );
        if (!branch.children) {
          break;
        }
        branch.children.map(function (x) {
          delete x.fields;
          delete x.children;
        });

        if (selectedValue == branch.id) {
          if (branch.children.length) {
            branch.children.map(function (x) {
              delete x.fields;
            });
            var o = {
              label: branch.geoName + " - ქვეკატეგორია",
              geoName: branch.geoName,
              id: branch.id,
              parentId: branch.id,
              items: branch.children,
              field_id: branch.field_id,
              type: "CATEGORY_SELECT_FIELD",
            };
            $scope.fields.splice(index + 1, 0, o);
          }

          branch.fields.map((x) => $scope.addModelField(x, branch.id));
          $scope.fields.push(...branch.fields);
        }
        k++;
      }

      replaceTextAreaAtLastIndex();

      function replaceTextAreaAtLastIndex() {
        if ($scope.fields[$scope.fields.length - 1].type !== "TEXTAREA_FIELD") {
          var textareaIndex = $scope.fields.findIndex(
            (x) => x.type == "TEXTAREA_FIELD"
          );
          if (textareaIndex >= 0) {
            var textArea = $scope.fields[textareaIndex];
            $scope.fields.splice(textareaIndex, 1);
            $scope.fields.push(textArea);
          }
        }
      }
    };

    $scope.ifChecked = function (field) {
      if (field.model) {
        field.times.from = "";
        field.times.to = "";
      }
    };

    $scope.replaceTextAreaAtLastIndex = function () {
      if ($scope.fields[$scope.fields.length - 1].type !== "TEXTAREA_FIELD") {
        var textareaIndex = $scope.fields.findIndex(
          (x) => x.type == "TEXTAREA_FIELD"
        );
        if (textareaIndex >= 0) {
          var textArea = $scope.fields[textareaIndex];
          $scope.fields.splice(textareaIndex, 1);
          $scope.fields.push(textArea);
        }
      }
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
        field.is24 = false;
      }

      if (field.type == "PHONE_FIELD") {
        field.model = [];
      }

      if ($scope.metadata) {
        field.model =
          field.type == "NUMBER_FIELD"
            ? parseFloat($scope.metadata[field.id])
            : $scope.metadata[field.id];
        if (field.type == "TIME_FIELDS") {
          field.times.from = "";
          field.times.to = "";
          field.model = null;
          if ($scope.metadata[field.id]) {
            var timeArr = $scope.metadata[field.id].split("-");

            if ($scope.metadata[field.id].indexOf("-") >= 0) {
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
            } else {
              let is24 = $scope.metadata[field.id].split("_");
              if (is24) {
                field.is24 = true;
                field.model = "24:00_00:00";
              }
            }
          }
        }

        if (field.type == "PHONE_FIELD") {
          if ($scope.metadata[field.id]) {
            field.model = $scope.metadata[field.id]
              .split("|")
              .map((x) => (x = { phone: x }));
          }
        }
      }
    };

    $scope.recursive = function (branch, ind) {
      var next;
      if (branch) {
        if (branch.children.length) {
          var value = $scope.metadata[branch.children[0].field_id];
          next = branch.children.find(
            (x) => $scope.metadata.PARENTS.indexOf(x.id) >= 0 || x.id == value
          );

          if (!next) {
            return;
          }
          var o = {
            label: branch.geoName + " - ქვეკატეგორია",
            geoName: branch.geoName,
            id: branch.id,
            parentId: branch.id,
            items: branch.children,
            field_id: branch.field_id,
            type: "CATEGORY_SELECT_FIELD",
            model: next.id,
          };

          //$scope.fields.push(o);
          ind++;
          $scope.fields.splice(ind, 0, o);
        }

        if (branch.fields.length) {
          branch.fields.map((x) => $scope.addModelField(x, branch.id));
          $scope.fields.push(...branch.fields);
        }

        $scope.recursive(next, ind);
      }
    };

    $scope.traverseTree = function (tree) {
      var category_field_id = null;
      var branch = tree[0].children;
      for (var i in branch) {
        if (!branch[i].fields) {
          if (branch[i].type !== "CATEGORY_SELECT_FIELD") {
            $scope.addModelField(branch[i]);
            $scope.fields.push(branch[i]);
          } else {
            var parentSelectBoxObject = JSON.parse(JSON.stringify(branch[i]));
            category_field_id = parentSelectBoxObject.id;
            delete parentSelectBoxObject.children;
            parentSelectBoxObject.items.map(function (x) {
              delete x.children;
              delete x.fields;
            });
            if ($scope.metadata && $scope.metadata.PARENTS) {
              parentSelectBoxObject.model =
                $scope.metadata.PARENTS[$scope.metadata.PARENTS.length - 1];
            }
            $scope.fields.push(parentSelectBoxObject);
          }
        }
      }

      if ($scope.metadata && $scope.metadata.PARENTS) {
        var br = $scope.tree[0].children[0].items.find(
          (x) =>
            x.id == $scope.metadata.PARENTS[$scope.metadata.PARENTS.length - 1]
        );
        $scope.recursive(br, 0);
        $scope.treeIdies.push(
          ...Object.assign([], $scope.metadata.PARENTS).reverse()
        );
      }

      if ($scope.metadata) {
        $scope.treeIdies.push(parseInt($scope.metadata[category_field_id]));
      }

      $scope.replaceTextAreaAtLastIndex();
    };

    $scope.showHide = function (field) {
      return (
        !field.hasOwnProperty("parentId") ||
        $scope.treeIdies.indexOf(parseInt(field.parentId)) >= 0
      );
    };

    $scope.formatPrefixZero = function (str) {
      if (!isNaN(parseInt(str))) {
        if (parseInt(str) < 10) {
          return "0" + str.toString();
        }
      }

      return str;
    };

    $scope.save = function (valid) {
      //$scope.isSubmited = true;
      if (
        !$scope.generalForm.$valid ||
        $scope.fields
          .filter((x) => x.field_id == 14 || x.id == 14)
          .filter((x) => x.model == 0).length > 0
      ) {
        $scope.generalForm.submitted = true;
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
          if (
            !$scope.fields[i].model &&
            (!$scope.fields[i].required == 2 ||
              $scope.treeIdies.indexOf($scope.fields[i].parentId) < 0)
          ) {
            continue;
          }

          if ($scope.fields[i].required == 2 && !$scope.fields[i].model) {
            mandatory_fields.push($scope.fields[i]);
          }
          if (
            typeof $scope.fields[i].parentId == "undefined" ||
            $scope.treeIdies.indexOf($scope.fields[i].parentId) >= 0
          ) {
            if (
              $scope.fields[i].type == "TIME_FIELDS" &&
              !$scope.fields[i].model
            ) {
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

              if ((!!from || !!to) && !(!!from && !!to)) {
                return;
              }

              $scope.fields[i].model = from + (from || to ? "-" : "") + to;
            }
            $scope.parameters[$scope.fields[i].id] =
              $scope.fields[i].model == null ? "" : $scope.fields[i].model;

            if ($scope.fields[i].type == "PHONE_FIELD") {
              $scope.parameters[$scope.fields[i].id] = $scope.fields[i].model
                .map((x) => (x = x["phone"]))
                .join("|");
            }
          }
        }
      }

      $scope.parameters.editing = false;
      if ($scope.metadata) {
        $scope.parameters.editing = true;
      }

      StorageService.setvalue(
        "selectBoxCount",
        JSON.stringify($scope.selectBoxCount)
      );

      StorageService.remove("processing_poi");
      $mdDialog.hide($scope.parameters);
    };

    $scope.cancel = function () {
      $mdDialog.cancel($scope.parameters);
      StorageService.remove("processing_poi");
    };

    if (StorageService.getValue(stepName)) {
      $scope.tree = JSON.parse(StorageService.getValue(stepName));

      var processing_poi = StorageService.getObject("processing_poi");
      //219744

      if (
        processing_poi &&
        processing_poi.fields.length &&
        (!$scope.metadata ||
          (Object.keys($scope.metadata).length == 1 &&
            $scope.metadata.PARENTS.length == 0))
      ) {
        $scope.fields = processing_poi.fields;
        $scope.treeIdies = processing_poi.treeIdies;
        return;
      }

      $scope.traverseTree($scope.tree, null);
      //StorageService.setvalue(stepName, JSON.stringify($scope.tree));
    } else {
      FormService.getFormFields(stepName).then(function (response) {
        $scope.tree = response.data;
        $scope.traverseTree($scope.tree, null);
        StorageService.setvalue(stepName, JSON.stringify($scope.tree));
      });
    }

    $scope.$watch(
      "fields",
      function (newVal, oldVal) {
        StorageService.saveObject("processing_poi", {
          fields: $scope.fields,
          treeIdies: $scope.treeIdies,
        });
        console.log("something has changed!");
      },
      true
    );
  };

  formController.$inject = [
    "$sce",
    "$scope",
    "MessagingService",
    "StorageService",
    "$mdDialog",
    "FormService",
    "stepName",
    "metadata",
    "existingParcelProperties",
  ];
  angular
    .module("datacollection.mypanel")
    .controller("FormHiCtrl", formController);
})();
