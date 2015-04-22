var equiv = {
    'LineSymbolizer/stroke': 'paint/line-color',
    'LineSymbolizer/stroke-width': 'paint/line-width',
    'PolygonSymbolizer/fill': 'paint/fill-color'
};

module.exports = function(layer) {
    var out = { id: layer.id, paint: {}, layout: {} };
    layer.rules.forEach(function(group) {
        group.forEach(function(subgroup) {
            subgroup.forEach(function(symbolizer) {
                console.log(symbolizer);
                symbolizer.properties.forEach(function(prop) {
                    try {
                        var gltype = equiv[symbolizer.symbolizer + '/' + prop[0]].split('/');
                        out[gltype[0]][gltype[1]] = prop[1];
                    } catch(e) {
                        console.log(symbolizer.symbolizer + '/' + prop);
                        console.log('no equivalent found for' + symbolizer.symbolizer + '/' + prop[0]);
                    }
                });
            });
        });
    });
    out.id = layer.id;
    return out;
};
