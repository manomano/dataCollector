var DefaultLayers = (function () {
  function DefaultLayers() {}

  DefaultLayers.prototype.getOrtholist = function () {
    const orthoNameArr = TABLE.filter((x) => x.placeId === utils.placeId());

    let orthoArr = [];
    let orthoMap = {};
    for (let i in orthoNameArr) {
      if (typeof this[orthoNameArr[i]] == 'function') {
        orthoArr.push(this[orthoNameArr[i]]());
        orthoMap[orthoNameArr[i]] = orthoArr[orthoArr.length - 1];
      }
    }

    return [orthoArr, orthoMap];
  };

  DefaultLayers.prototype.batumiOrthoLayer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=BATUMI_2015';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };

  DefaultLayers.prototype.dummyLayer = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://10.11.11.234:8080/geoserver/wms',
        params: { LAYERS: 'cite:AREA_ASSIGNMENT', TILED: true },
        serverType: 'geoserver',
      }),
      visible: true,
    });
    layer.set('type', 'ortho');
    layer.set('name', 'assignments');
    return layer;
  };

  DefaultLayers.prototype.existingParcels = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://10.11.11.234:8080/geoserver/wms',
        params: { LAYERS: 'cite:PARCEL', TILED: true },
        serverType: 'geoserver',
        CQL_FILTER: 'PARCEL_ID=1',
      }),
      visible: true,
    });
    layer.set('type', 'tile');
    layer.set('name', 'existingParcels');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2014_DASAVLETI_WMS = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://mp.napr.gov.ge/ORTHO_2014_DASAVLETI/service?',
        params: {
          LAYERS: 'ORTHO_2014_DASAVLETI',
          FORMAT: 'image/png',
          TRANSPARENT: true,
          SRS: 'EPSG:900913',
        },
        serverType: 'geoserver',
      }),
      visible: false,
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2014_DASAVLETI_WMS');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2015_SAMEGRELO_WMS = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://mp.napr.gov.ge/ORTHO_2015_SAMEGRELO/service?',
        params: {
          LAYERS: 'ORTHO_2015_SAMEGRELO',
          FORMAT: 'image/png',
          TRANSPARENT: true,
          SRS: 'EPSG:900913',
        },
        serverType: 'geoserver',
      }),
      visible: false,
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2015_SAMEGRELO_WMS');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2015_SAMEGRELO_WMTS = function () {
    [resolutions, matrixIds, projection, projectionExtent] =
      getResolutionAndIdis('EPSG:900913');

    var layer = new ol.layer.Tile({
      opacity: 0.8,
      style: 'default',
      wrapX: true,
      visible: false,
      source: new ol.source.WMTS({
        url: 'http://mp.napr.gov.ge/ORTHO_2015_SAMEGRELO/wmts/ORTHO_2015_SAMEGRELO/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        layer: 'ORTHO_2015_SAMEGRELO',
        matrixSet: 'GLOBAL_MERCATOR',
        //layer: '0',
        //matrixSet: 'EPSG:900913',
        format: 'image/png',
        projection: projection,
        requestEncoding: 'REST',
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
      }),
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2015_SAMEGRELO_WMTS');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2016_17_NORV = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://mp.napr.gov.ge/ORTHO_2016-17_NORV/service?',
        params: {
          LAYERS: 'ORTHO_2016-17_NORV',
          FORMAT: 'image/png',
          TRANSPARENT: true,
          SRS: 'EPSG:900913',
        },
        serverType: 'geoserver',
      }),
      visible: false,
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2016_17_NORV');
    return layer;
  };

  function getResolutionAndIdis(proj) {
    var projection = ol.proj.get(proj);
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(22);
    var matrixIds = new Array(22);
    for (var z = 0; z < 22; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    return [resolutions, matrixIds, projection, projectionExtent];
  }

  DefaultLayers.prototype.ORTHO_2016_17_NORV_WMTS = function () {
    [resolutions, matrixIds, projection, projectionExtent] =
      getResolutionAndIdis('EPSG:900913');

    var layer = new ol.layer.Tile({
      opacity: 0.8,
      style: 'default',
      wrapX: true,
      visible: false,
      source: new ol.source.WMTS({
        url: 'http://mp.napr.gov.ge/ORTHO_2016-17_NORV/wmts/ORTHO_2016-17_NORV/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        layer: 'ORTHO_2016-17_NORV',
        matrixSet: 'GLOBAL_MERCATOR',
        //layer: '0',
        //matrixSet: 'EPSG:900913',
        format: 'image/png',
        projection: projection,
        requestEncoding: 'REST',
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
      }),
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2016_17_NORV_WMTS');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2014_DASAVLETI = function () {
    [resolutions, matrixIds, projection, projectionExtent] =
      getResolutionAndIdis('EPSG:900913');

    var layer = new ol.layer.Tile({
      opacity: 0.8,
      style: 'default',
      wrapX: true,
      visible: false,
      source: new ol.source.WMTS({
        url: 'http://mp.napr.gov.ge/ORTHO_2014_DASAVLETI/wmts/ORTHO_2014_DASAVLETI/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        layer: 'ORTHO_2014_DASAVLETI',
        matrixSet: 'GLOBAL_MERCATOR',
        //layer: '0',
        //matrixSet: 'EPSG:900913',
        format: 'image/png',
        projection: projection,
        requestEncoding: 'REST',
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
      }),
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2014_DASAVLETI');
    return layer;
  };

  DefaultLayers.prototype.batumiRoadsWMSLayer = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://nv1.napr.gov.ge/geoserver/cite/wms',
        params: { LAYERS: 'cite:AR_BATUMI_ROADL', TILED: true },
        serverType: 'geoserver',
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  DefaultLayers.prototype.ortho2014Layer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        cacheSize: 20,
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2014_COL';
          // let url = "http://navigation-cache.napr.gov.ge/NGCache/Layer/getTile?x=" + x + "&y=" + y + "&z=" + z + "&l=ORTHO_2014_COL";
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_GEORGIA_COL = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      //defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        //cacheSize: 20,
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt2.napr.gov.ge/ng-cache/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_GEORGIA_COL';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    layer.set('name', 'geoCol');
    return layer;
  };

  DefaultLayers.prototype.NORV = function () {
    var layer = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: 'http://mp.napr.gov.ge/ORTHO_2016-17_NORV/service?',
        crossOrigin: 'anonymous',
        params: {
          LAYERS: 'ORTHO_2016-17_NORV',
          FORMAT: 'image/png',
          SRS: 'EPSG:900913',
          CRS: 'EPSG:3857',
          EXCEPTIONS: 'application/vnd.ogc.se_inimage',
          SERVICE: 'WMS',
          REQUEST: 'GetMap',
          VERSION: '1.3.0',
        },
        serverType: 'mapserver',
      }),
      visible: true,
    });
    layer.set('type', 'tile');
    layer.set('name', 'NORV');
    return layer;
  };

  DefaultLayers.prototype.NORV_wmts = function () {
    var projection = ol.proj.get('EPSG:900913');
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(22);
    var matrixIds = new Array(22);
    for (var z = 0; z < 22; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    var layer = new ol.layer.Tile({
      opacity: 0.8,
      style: 'default',
      wrapX: true,
      visible: false,
      source: new ol.source.WMTS({
        url: 'http://mp.napr.gov.ge/ORTHO_2016-17_NORV/wmts/ORTHO_2016-17_NORV/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        layer: 'ORTHO_2016-17_NORV',
        matrixSet: 'GLOBAL_MERCATOR',
        //layer: '0',
        //matrixSet: 'EPSG:3857',
        format: 'image/png',
        projection: projection,
        requestEncoding: 'REST',
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
      }),
    });
    layer.set('type', 'tile');
    layer.set('name', 'orthoNorv');
    return layer;
  };

  DefaultLayers.prototype.ORTHO_2000_10_SATEL = function () {
    var projection = ol.proj.get('EPSG:900913');
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(22);
    var matrixIds = new Array(22);
    for (var z = 0; z < 22; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    var layer = new ol.layer.Tile({
      opacity: 0.8,
      style: 'default',
      wrapX: true,
      visible: false,
      source: new ol.source.WMTS({
        url: 'http://mp.napr.gov.ge/ORTHO_2000_10_SATEL/wmts/ORTHO_2000_10_SATEL/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
        layer: 'ORTHO_2000_10_SATEL',
        matrixSet: 'GLOBAL_MERCATOR',
        //layer: '0',
        //matrixSet: 'EPSG:900913',
        format: 'image/png',
        projection: projection,
        requestEncoding: 'REST',
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds,
        }),
      }),
    });
    layer.set('type', 'tile');
    layer.set('name', 'ORTHO_2000_10_SATEL');
    return layer;
  };

  DefaultLayers.prototype.ortho2010Layer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2010_COL';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  DefaultLayers.prototype.ortho2015Layer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2015_COL';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  DefaultLayers.prototype.ortho2005Layer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2005_COL';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  DefaultLayers.prototype.satelliteColorLayer = function () {
    var layer = new ol.layer.Tile({
      //preload: 1,
      opacity: 0.8,
      //defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt2.napr.gov.ge/ng-cache/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_AT_BORDER_SAT';

          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    layer.set('name', 'ortho');
    return layer;
  };

  DefaultLayers.prototype.ortho2016_2017 = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      //defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt2.napr.gov.ge/ng-cache/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2016_2017_COL';

          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    layer.set('name', 'ortho');
    return layer;
  };

  DefaultLayers.prototype.ortho2000Layer = function () {
    var extent = [
      43.41939043236596, 42.01151983284973, 43.55818110615685,
      42.13100587979776,
    ];
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      //defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2000_BW';
          return url;
        },
      }),
      // extent: ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'),
      visible: false,
    });

    layer.set('type', 'ortho');
    layer.set('name', 'ortho2000');

    return layer;
  };
  DefaultLayers.prototype.ortho2016Layer = function () {
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      //defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://nt0.reestri.gov.ge/NGCache?x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z +
            '&l=ORTHO_2016_COL';
          return url;
        },
      }),
      visible: false,
    });
    layer.set('type', 'ortho');
    layer.set('name', 'ortho2016');
    return layer;
  };
  DefaultLayers.prototype.openStreetMapLayer = function () {
    var layer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      name: 'OSM',
      visible: true,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  DefaultLayers.prototype.googleSateliteOrtho = function () {
    var extent = [
      43.41939043236596, 42.01151983284973, 43.55818110615685,
      42.13100587979776,
    ];
    var layer = new ol.layer.Tile({
      preload: 1,
      opacity: 0.8,
      defaultProjection: 'EPSG:900913',
      projection: 'EPSG:4326',
      source: new ol.source.TileImage({
        tileUrlFunction: function (coordinate) {
          if (coordinate === null) return undefined;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = -coordinate[2] - 1;
          var url =
            'http://khm1.googleapis.com/kh?v=724&hl=en-US&&x=' +
            x +
            '&y=' +
            y +
            '&z=' +
            z;
          return url;
        },
      }),
      // extent: ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857'),
      visible: false,
    });
    layer.set('type', 'ortho');
    return layer;
  };
  return DefaultLayers;
})();
//# sourceMappingURL=DefaultLayers.js.map
