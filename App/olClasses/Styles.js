var Styles = (function () {
    function Styles() {
    }
    Styles.createTextStyle = function (feature) {

        var text = feature.get("BLOCK_ID")?"BLOCK_ID: " + feature.getProperties()["BLOCK_ID"].toString():"GROUP_ID: " + feature.getProperties()["GROUP_ID"].toString()
        var align = "center";
        var baseline = "middle";
        return new ol.style.Text({
            textAlign: align,
            textBaseline: baseline,
            text: text,
            scale:2
        });
    };

    return Styles;
}());
// Line String Arrow Styling Function Begin
Styles.signsStykeFunction = function (feature) {
    var geometry = feature.getGeometry();
    var styles = [
        Styles.POIFeatureStyle
    ];
    if (geometry.getType() == "Point")
        return styles;
    geometry.forEachSegment(function (start, end) {
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        // arrows
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
                src: 'https://openlayers.org/en/v3.19.1/examples/data/arrow.png',
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation
            })
        }));
    });
    return styles;
};
// Line String Arrow Styling Function End
//TODO make transparent
Styles.completeTaskStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#08ff00',
        width: 2
    }),
    fill: new ol.style.Fill({ color: '#75ee7b' })
});
Styles.ongoingTaskStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#f44e42',
        width: 4
    }),
});





Styles.startingTaskStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#160bd8',
        width: 2
    }),
});

Styles.delayedTaskStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#aa7dff',
        width: 2
    }),
    fill: new ol.style.Fill({
        color: '#efe3ff'
    }),
});

Styles.POIFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ffb500'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#fff6aa'
    }),
    stroke: new ol.style.Stroke({
        color: '#01579b',
        width: 2
    })
});


/*Styles.trafficSignFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ff52f5'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#ff37f5'
    }),
    stroke: new ol.style.Stroke({
        color: '#ff1d49',
        width: 2
    })
});*/




Styles.trafficSignFeatureStyle = function(feature) {
    var geometry = feature.getGeometry();
    var styles = [
        // linestring
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff1d49',
                width: 2
            })
        })
    ];

    //
    var lineGeom = new ol.geom.LineString(geometry.getCoordinates())

    lineGeom.forEachSegment(function(start, end) {
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        // arrows
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
                src: 'Content/img/arrow.png',
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation
            })
        }));
    });

    return styles;
};


Styles.arrowFeatureStyle = function(feature) {
    var geometry = feature.getGeometry();
    var styles = [
        // linestring
        //Styles.CurrentDrawingStyle
        Styles.POIFeatureStyle
       /* new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff1d49',
                width: 2
            })
        })*/
    ];

    //
    var lineGeom = new ol.geom.LineString(geometry.getCoordinates())

    lineGeom.forEachSegment(function(start, end) {
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        // arrows
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
                src: 'https://openlayers.org/en/v3.19.1/examples/data/arrow.png',
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation
            })
        }));
    });

    return styles;
};





Styles.parcelsFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#01579b'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#fff6aa'
    }),
    stroke: new ol.style.Stroke({
        color: '#01579b',
        width: 2
    })
});


Styles.existingParcelsFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#01579b'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#ff9900'
    }),
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 2
    })
});


    Styles.parcelEntrancesFeatureStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#01579b'
            }),
            radius: 5
        }),
        fill: new ol.style.Fill({
            color: '#fff6aa'
        }),
        stroke: new ol.style.Stroke({
            color: '#01579b',
            width: 2
        })
});










Styles.buildingsFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#923dd0'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#fff6aa'
    }),
    stroke: new ol.style.Stroke({
        color: '#923dd0',
        width: 2
    })
});

Styles.existingBuildingsFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#923dd0'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#ffff00'
    }),
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 2
    })
});

Styles.buildingEntrancesFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#923dd0'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#fff6aa'
    }),
    stroke: new ol.style.Stroke({
        color: '#923dd0',
        width: 2
    })
});





Styles.CurrentDrawingStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ff230b'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#efe3ff'
    }),
    stroke: new ol.style.Stroke({
        color: '#371c94',
        width: 2
    })
});





Styles.busStationsStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ff5963'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#ffb500'
    }),
    stroke: new ol.style.Stroke({
        color: '#ffb500',
        width: 2
    })
});
Styles.gridLayerStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ffdf00'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#ffdf00'
    }),
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 1.25
    })
});
// Measurement Layer Style
Styles.measurementLayerStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ff3847',
        width: 2
    }),
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: '#ff3847'
        })
    })
});
Styles.defaultStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
            color: '#33bef1',
            width: 3
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    }),
    stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 3
    })
});


Styles.errorStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#ff1d49'
        }),
        stroke: new ol.style.Stroke({
            color: '#ff1d49',
            width: 3
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    }),
    stroke: new ol.style.Stroke({
        color: '#ff1d49',
        width: 3
    })
});


Styles.selectLayerStyleFunction = function (feature) {
    var styles = [];
    console.log(feature.getGeometry().getType());
    var geometryType = feature.getGeometry().getType();
    if (geometryType == 'Polygon')
        styles.push(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0099ff',
                width: 3
            })
        }));
    else if (geometryType == 'Point')
        styles.push(new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: '#0099ff'
                }),
                radius: 5
            }),
            fill: new ol.style.Fill({
                color: '#0099ff'
            }),
        }));
    else if (geometryType == 'LineString')
        styles.push(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#0099ff',
                width: 4
            })
        }));
    return styles;
};
//User GPS feature style
Styles.userGPSFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#1012ff'
        }),
        radius: 7
    }),
    fill: new ol.style.Fill({
        color: '#1810ff'
    }),
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 1.25
    })
});
Styles.gridTaskStyleFunction = function (feature) {
    var styles = [];
    var featureStatus = feature.getProperties()['STATUS_NAME'];
    if (featureStatus == 'finished') {
        feature.set('completed', 'true');
        styles.push(Styles.completedTaskStyle);
    }
    else if (featureStatus == 'ongoing') {
        styles.push(Styles.ongoingTaskStyle);
    }
    else {
        styles.push(Styles.plannedTaskStyle);
    }
    styles.push(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.1)' }),
            stroke: new ol.style.Stroke({ color: 'red', width: 2 })
        }),
        text: Styles.createTextStyle(feature)
    }));
    return styles;
};
Styles.roadsTaskStyleFunction = function (feature) {
    var featureStatus = feature.getProperties()['STATUS_NAME'];
    if (featureStatus == 'finished') {
        feature.set('completed', 'true');
        return Styles.completedTaskStyle;
    }
    else if (featureStatus == 'ongoing') {
        return Styles.ongoingTaskStyle;
    }
    else {
        return Styles.plannedTaskStyle;
    }
};
Styles.taskStyleFunction = function (feature) {
    var featureStatus = feature.getProperties()['STATUS_NAME'];
    if (featureStatus == 'finished') {
        feature.set('completed', 'true');
        return Styles.completedTaskStyle;
    }
    else if (featureStatus == 'ongoing') {
        return Styles.ongoingTaskStyle;
    }
    else {
        return Styles.plannedTaskStyle;
    }
};
Styles.pointAssignmentLayerStyle = function (feature) {
    var align = "center";
    var baseline = "middle";
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ff3847',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 11,
            fill: new ol.style.Fill({
                color: '#ff3847'
            })
        }),
        text: new ol.style.Text({
            offsetY: -20,
            scale: 3,
            textAlign: align,
            textBaseline: baseline,
            text: feature.getProperties()["text"],
            fill: new ol.style.Fill({
                color: '#ff3847'
            })
        })
    });
};


Styles.assignmentsFeatureStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#923dd0'
        }),
        radius: 5
    }),
    fill: new ol.style.Fill({
        color: '#fff6aa'
    }),
    stroke: new ol.style.Stroke({
        color: '#923dd0',
        width: 2
    })
});



//# sourceMappingURL=Styles.js.map