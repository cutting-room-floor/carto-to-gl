var carto = require('carto'),
    fs = require('fs'),
    path = require('path');

module.exports = function(input) {
    try {
        var str = loadMML(input);
        var output = new carto.Renderer({
            filename: input,
            local_data_dir: path.dirname(input)
        }).render(str);
        return output;
    } catch(err) {
        if (Array.isArray(err)) {
            err.forEach(function(e) {
                carto.writeError(e, options);
            });
        } else { throw err; }
    }
};

function loadMML(file) {
    var mml = JSON.parse(fs.readFileSync(file, 'utf-8'));
    mml.Stylesheet = mml.Stylesheet.map(function(s) {
        console.log(s);
        return {
            id: s,
            data: fs.readFileSync(path.join(path.dirname(file), s), 'utf-8')
        };
    });
    return mml;
}
