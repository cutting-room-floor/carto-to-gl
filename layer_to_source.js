function deriveType(layer) {
    if (layer.Datasource.file.match(/geojson$/)) {
        return 'geojson';
    }
}

module.exports = function(layer) {
    if (deriveType(layer) === 'geojson') {
        return {
            id: layer.name,
            value: {
                type: 'geojson',
                data: layer.Datasource.file
            }
        };
    }
};
