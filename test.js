var test = require('tape'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    togl = require('./');

// fixture(test, 'fixtures/basic.mml', 'fixtures/basic.json');
fixture(test, 'node_modules/mapbox-studio-streets-basic/project.yml', 'fixtures/streets.json');

function helperMML(file) {
    if (file.match(/json$/)) {
        var mml = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } else {
        var mml = yaml.load(fs.readFileSync(file, 'utf-8'));
    }
    mml.Stylesheet = _(mml.Stylesheet || mml.styles).map(function(s) {
        return {
            id: s,
            data: fs.readFileSync(path.join(path.dirname(file), s), 'utf-8')
        };
    });
    mml.Layer = mml.Layer || [];
    return mml;
}

function fixture(t, filename, outputFilename) {
    t.test(filename, function(tt) {
        var data = helperMML(filename);
        var result = new togl.Renderer({
            filename: filename,
            local_data_dir: path.dirname(filename)
        }).render(data);
        if (process.env.UPDATE) {
            console.log(result);
            fs.writeFileSync(outputFilename, JSON.stringify(result, null, 2));
        }
        var expected = JSON.parse(fs.readFileSync(outputFilename));
        tt.deepEqual(result, expected);
        tt.end();
    });
}
