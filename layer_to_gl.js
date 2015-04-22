var equiv = {
    'LineSymbolizer/stroke': 'paint/line-color',
    'LineSymbolizer/stroke-width': 'paint/line-width',
    'PolygonSymbolizer/fill': 'paint/fill-color'
};

module.exports = function(layer) {
    var layers = [];
    layer.rules.forEach(function(group, i) {
        group.forEach(function(subgroup, j) {
            subgroup.forEach(function(symbolizer, k) {
                var out = { id: layer.id, paint: {}, layout: {} };
                symbolizer.properties.forEach(function(prop) {
                    try {
                        var gltype = equiv[symbolizer.symbolizer + '/' + prop[0]].split('/');
                        out[gltype[0]][gltype[1]] = prop[1];
                    } catch(e) {
                        console.log(symbolizer.symbolizer + '/' + prop);
                        console.log('no equivalent found for' + symbolizer.symbolizer + '/' + prop[0]);
                    }
                });
                out.__original__layer = layer.id;
                if (symbolizer.zoom) {
                    if (symbolizer.zoom.minzoom) out.minzoom = symbolizer.zoom.minzoom;
                    if (symbolizer.zoom.maxzoom) out.maxzoom = symbolizer.zoom.maxzoom;
                }
                out.id = layer.id + [,i,j,k].join('-');
                layers.push(out);
            });
        });
    });
    return layers;
};
