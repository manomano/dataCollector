(function () {
  var panelController = function (
    $window,
    authService,
    $auth,
    $location,
    MessagingService,
    $scope,
    StorageService,
    $rootScope,
    flowControllerService,
    initialControllerService,
    parcelControllerService,
    parcelEntranceControllerService,
    buildingControllerService,
    buildingEntranceControllerService,
    simpleObjectControllerService,
    DrawingControllerService
  ) {
    if (!authService.isSignedIn()) {
      $location.path('/login');
      return;
    }

    var auth = StorageService.getValue('Authorization');

    if (!auth) {
      if (typeof sessionController !== 'undefined') {
        var sess = JSON.parse(sessionController.getSession());

        if (sess.Authorization) {
          StorageService.setvalue('Authorization', sess.Authorization);
          StorageService.setvalue('mapState', sess.mapState);
        }
      }
    } else {
      if (typeof sessionController !== 'undefined') {
        sessionController.setSession(
          JSON.stringify({
            Authorization: auth,
            mapState: StorageService.getValue('mapState'),
          })
        );
      }
    }

    $scope.roleDictionary = {
      admin: 'ROLE_ADMIN',
      pebe: 'ROLE_PEBE_OPERATOR',
      traffic: 'ROLE_TRAFFIC_OPERATOR',
    };
    $scope.theRole = '';
    $scope.searchType = '';
    $scope.searchable_id = null;
    $scope.searchTypes = [
      { title: 'არსებული პარსელები', value: 'existingParcels' },
      { title: 'შენობა', value: 'buildings' },
      { title: 'შენობის შესასვლელები', value: 'buildingEntrances' },
      { title: 'ნაკვეთი', value: 'parcels' },
      { title: 'ნაკვეთის შესასვლელები', value: 'parcelEntrances' },
      { title: 'დავალება  - გრიდი', value: 'assignments' },
      {
        title: 'დავალება - გზები - groupId',
        value: 'roadAssignmentsByGroupId',
      },
      {
        title: 'დავალება - გზები - objectId',
        value: 'roadAssignmentsByObjectId',
      },
      { title: 'ავობუსის გაჩერება', value: 'busStops' },
      { title: 'საგზაო ნიშნები', value: 'trafficSigns' },
      { title: 'POI', value: 'pois' },
    ];

    if (auth) {
      $scope.theRole = JSON.parse(
        StorageService.getValue('Authorization')
      ).role;
      sessionVar = JSON.parse(StorageService.getValue('Authorization'));
    }

    $rootScope.isWMS = JSON.parse(
      StorageService.hasProperty('isWMS')
        ? StorageService.getValue('isWMS')
        : true
    );
    StorageService.setvalue('isWMS', $rootScope.isWMS);
    let layerClassInstance, LAYERS;

    if ($rootScope.isWMS || $scope.theRole == $scope.roleDictionary.admin) {
      $rootScope.isWMS = true;
      layerClassInstance = new NGCACHEDataGatheringLayers();
    } else {
      layerClassInstance = new WFSDataGatheringLayers();
    }
    $scope.wms_wfs = $rootScope.isWMS ? 'WFS' : 'WMS';

    if ($scope.theRole == $scope.roleDictionary.admin) {
      //var LAYERS = new AdminOperatorLayers(new WMSDataGatheringLayers());
      LAYERS = new AdminOperatorLayers(layerClassInstance);
    } else if ($scope.theRole == $scope.roleDictionary.pebe) {
      //var LAYERS = new AdminOperatorLayers(new WMSDataGatheringLayers());
      LAYERS = new PoiPebeOperatorLayers(layerClassInstance);
    } else if ($scope.theRole == $scope.roleDictionary.traffic) {
      LAYERS = new TrafficSignOperatorLayers(layerClassInstance);
    }

    let view = utils['get' + sessionVar.placeName + 'View'];
    if (!view) {
      const placeName = sessionVar.placeName.split('').reduce((a, b) => {
        a = a + (b.charCodeAt(0) >= 48 && b.charCodeAt(0) <= 57 ? '' : b);
        return a;
      });
      view = utils['get' + placeName + 'View'];
    }

    $rootScope.map = new MapController(LAYERS.layersList, 'map', view);

    if ($rootScope.isWMS) {
      $rootScope.layerOrg = new layerOrganizerWMS(
        $rootScope.map,
        $rootScope.map.layers
      );
    } else {
      $rootScope.layerOrg = new layerOrganizerWFS($rootScope.map.layers);
    }
    $scope.refreshLayer = function () {
      $rootScope.layerOrg.refreshLayer('parcels');
    };

    if (StorageService.getObject('Authorization').userId == 6) {
      $rootScope.map.layers
        .filter((x) =>
          [
            'pois',
            'all',
            'ORTHO_2014_DASAVLETI',
            'existingParcels',
            'existingObjects',
            'assignments',
            'OSM',
          ].includes(x.get('name'))
        )
        .map((item) => item.setVisible(true));
    }

    if (
      StorageService.getObject('mapState') &&
      StorageService.getObject('mapState').layers
    ) {
      var selectedLayers = StorageService.getObject('mapState').layers;

      for (var i = 0; i < $rootScope.map.layers.length; i++) {
        if (selectedLayers.indexOf($rootScope.map.layers[i].get('name')) >= 0) {
          $rootScope.map.layers[i].setVisible(true);
        } else {
          $rootScope.map.layers[i].setVisible(false);
        }
      }
    }

    $scope.layerChecks = [];
    $scope.layerDictionary = {
      parcels: 'ნაკვეთები',
      buildings: 'შენობები',
      buildingEntrances: 'შენობის შესასვლელები',
      parcelEntrances: 'ნაკვეთის შესასვლელები',
      assignments: 'დავალებები - გრიდი',
      roadAssignments: 'დავალებები - გზები',
      busStops: 'ავტობუსის გაჩერებები',
      existingParcels: 'არსებული პარსელები',
      existingBuildings: 'არსებული შენობები',
      trafficSigns: 'საგზაო ნიშნები',
      OSM: 'OSM',
      pois: 'POI',
      ortho: 'ortho2016-2017',
      ortho2000: 'ortho2000',
      ortho2016: 'ortho2016',
      existingObjects: 'არსებული ობიექტები',
      all: 'PEBE',
      geoCol: 'geoCol',
      orthoNorv: 'orthoNorv',
      ORTHO_2000_10_SATEL: 'ORTHO 2000-10 SATEL',
      /* 'ORTHO_2014_DASAVLETI':'ORTHO 2014 VMTS',
            "ORTHO_2014_DASAVLETI_WMS":"ORTHO 2014 VMS",
            "ORTHO_2016_17_NORV_WMTS":"ORTHO 2016 WMTS",
            "ORTHO_2016_17_NORV":"ORTHO 2016 WMS"*/
    };

    $scope.orthoPairValues = {
      0: { value: '', lastValue: '' },
      1: { value: '', lastValue: '' },
    };

    $scope.orthoPairs = [
      [
        { key: 'ORTHO_2014_DASAVLETI', title: 'ORTHO 2014 WMTS' },
        { key: 'ORTHO_2014_DASAVLETI_WMS', title: 'ORTHO 2014 WMS' },
        { key: 'none|0', title: 'arcerti' },
      ],
      [
        { key: 'ORTHO_2016_17_NORV', title: 'ORTHO 2016 WMS' },
        { key: 'ORTHO_2016_17_NORV_WMTS', title: 'ORTHO 2016 WMTS' },
        { key: 'none|1', title: 'arcerti' },
      ],
      [
        { key: 'ORTHO_2015_SAMEGRELO_WMS', title: 'ORTHO 2015 samegrelo' },
        {
          key: 'ORTHO_2015_SAMEGRELO_WMTS',
          title: 'ORTHO 2015 samegrelo WMTS',
        },
        { key: 'none|1', title: 'arcerti' },
      ],
    ];

    $scope.orthoOpposites = {
      ORTHO_2014_DASAVLETI: 'ORTHO_2014_DASAVLETI_WMS',
      ORTHO_2014_DASAVLETI_WMS: 'ORTHO_2014_DASAVLETI',
      ORTHO_2016_17_NORV: 'ORTHO_2016_17_NORV_WMTS',
      ORTHO_2016_17_NORV_WMTS: 'ORTHO_2016_17_NORV',
      ORTHO_2015_SAMEGRELO_WMS: 'ORTHO_2015_SAMEGRELO_WMTS',
      ORTHO_2015_SAMEGRELO_WMTS: 'ORTHO_2015_SAMEGRELO_WMS',
    };

    $rootScope.map.layers.map(function (el) {
      if (el.get('name')) {
        var name = el.get('name');
        var label = $scope.layerDictionary[name];
        if (label) {
          $scope.layerChecks.push({
            name: label,
            model: el.get('visible'),
            value: name,
          });
        }
        if ($scope.orthoOpposites.hasOwnProperty(name)) {
          if (el.get('visible')) {
            $scope.orthoPairValues[name.indexOf('NORV') >= 0 ? 1 : 0].value =
              name;
          }
        }
      }
    });

    $scope.emptyCache = function () {
      StorageService.clear();
      $window.location.reload();
    };

    $scope.signOut = function () {
      $scope.emptyCache();
      $auth.logout();
      MessagingService.displaySuccess('კარგად ბრძანდებოდეთ');
      $location.path('/login');
      $window.location.reload();
    };

    $scope.switchWMS_WFS = function () {
      StorageService.setvalue('isWMS', !$rootScope.isWMS);
      $window.location.reload();
    };

    $scope.selectOrtho = function (selected, it) {
      console.log(it);
      if (selected.value.substring(0, 4) == 'none') {
        for (let i = 0; i < 2; i++) {
          $scope.changeLayerVisibilityByValue(it.pair[i].key, false);
        }
      } else {
        $scope.changeLayerVisibilityByValue(selected.value, true);
        $scope.changeLayerVisibilityByValue(
          $scope.orthoOpposites[selected.value],
          false
        );
      }
    };

    $scope.changeLayerVisibilityByValue = function (layerName, visibility) {
      var layer = $rootScope.map.layers.find(function (x) {
        return x.get('name') == layerName;
      });

      if (!layer) {
        return;
      }

      layer.setVisible(visibility);
      var mapState = StorageService.getObject('mapState');

      if (!mapState) {
        mapState = {};
      }

      if (mapState && mapState.layers) {
        var index = mapState.layers.indexOf(layer.get('name'));
        if (visibility) {
          mapState.layers.push(layer.get('name'));
        } else {
          if (index >= 0) {
            mapState.layers.splice(index, 1);
          }
        }
      } else {
        mapState.layers = [];
        mapState.layers.push(layer.get('name'));
      }

      $rootScope.map.defaultMode();
      initialControllerService.cancelSelection();
      StorageService.saveObject('mapState', mapState);
    };

    $scope.changeLayerVisibility = function (layerName) {
      var layer = $rootScope.map.layers.find(function (x) {
        return x.get('name') == layerName;
      });

      if (!layer) {
        return;
      }

      layer.setVisible(!layer.get('visible'));

      var mapState = StorageService.getObject('mapState');
      if (!mapState) {
        mapState = {};
      }

      if (mapState && mapState.layers) {
        var index = mapState.layers.indexOf(layer.get('name'));
        if (index >= 0) {
          mapState.layers.splice(index, 1);
        } else {
          mapState.layers.push(layer.get('name'));
        }
      } else {
        mapState.layers = [];
        mapState.layers.push(layer.get('name'));
      }

      $rootScope.map.defaultMode();
      initialControllerService.cancelSelection();
      StorageService.saveObject('mapState', mapState);
    };

    $scope.search = function () {
      $rootScope.map.defaultMode();
      initialControllerService.cancelSelection();
      initialControllerService.selectGeometry();

      if ($scope.searchType && $scope.searchable_id) {
        var feature = $rootScope.layerOrg.search(
          $scope.searchType,
          $scope.searchable_id
        );

        if (feature) {
          if (feature.length) {
            var source = new ol.source.Vector();
            source.addFeatures(feature);
          }
          var extent = !feature.length
            ? feature.getGeometry().getExtent()
            : source.getExtent();
          $rootScope.map.map.getView().fit(extent);

          if (!feature.length) {
            $scope.initialControllerService.featureSelector.selectFeature(
              feature
            );
          } else {
            $scope.initialControllerService.featureSelector.selectFeatures(
              feature
            );
          }
          return;
        }

        MessagingService.displaySuccess('ობიექტი არ მოიძებნა');
        return;

        var layerName = $scope.searchType;
        var found = false;
        var layer;

        for (var i = 0; i < $rootScope.map.layers.length; i++) {
          if ($rootScope.map.layers[i].get('name') == layerName) {
            layer = $rootScope.map.layers[i];
            break;
          }
        }

        if (layer) {
          var feature = layer
            .getSource()
            .getFeatures()
            .find(function (x) {
              return x.get('ID') == $scope.searchable_id;
            });

          if (feature) {
            found = true;
            var coordinates = feature.getGeometry().getCoordinates();
            var extent = feature.getGeometry().getExtent();
            $rootScope.map.map.getView().fit(extent);
            $scope.initialControllerService.featureSelector.selectFeature(
              feature
            );
          }
        }
        if (!found) {
          MessagingService.displaySuccess('ობიექტი არ მოიძებნა');
        }
      }
    };

    flowControllerService.init($scope.map);
    $scope.initialControllerService = initialControllerService;
    $scope.parcelControllerService = parcelControllerService;
    $scope.parcelEntranceControllerService = parcelEntranceControllerService;
    $scope.buildingControllerService = buildingControllerService;
    $scope.buildingEntranceControllerService =
      buildingEntranceControllerService;
    $scope.DrawingControllerService = DrawingControllerService;
    $scope.simpleObjectControllerService = simpleObjectControllerService;

    $scope.activeClass = true;
    $scope.showHidePanel = function () {
      $scope.activeClass = !$scope.activeClass;
    };
  };

  panelController.$inject = [
    '$window',
    'authService',
    '$auth',
    '$location',
    'MessagingService',
    '$scope',
    'StorageService',
    '$rootScope',
    'flowControllerService',
    'initialControllerService',
    'parcelControllerService',
    'parcelEntranceControllerService',
    'buildingControllerService',
    'buildingEntranceControllerService',
    'simpleObjectControllerService',
    'DrawingControllerService',
  ];

  angular
    .module('datacollection.mypanel')
    .controller('MainPanelCtrl', panelController);
})();
