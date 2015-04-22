var test = require('tape'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    togl = require('./');

fixture(test, 'fixtures/basic.mml');

function helperMML(file) {
    var mml = JSON.parse(fs.readFileSync(file, 'utf-8'));
    mml.Stylesheet = _(mml.Stylesheet).map(function(s) {
        return {
            id: s,
            data: fs.readFileSync(path.join(path.dirname(file), s), 'utf-8')
        };
    });
    return mml;
}

function fixture(t, filename) {
    t.test(filename, function(tt) {
        var outputFilename = filename.replace('.mml', '.json');
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
