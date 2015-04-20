var test = require('tape'),
    fs = require('fs'),
    path = require('path'),
    togl = require('./');

fixture(test, 'fixtures/basic.mml');

function fixture(t, filename) {
    t.test(filename, function(tt) {
        var output = filename.replace('.mml', '.json');
        var result = togl(filename);
        if (process.env.UPDATE) {
            fs.writeFileSync(output, JSON.stringify(result, null, 2));
        }
        var expected = JSON.parse(fs.readFileSync(output));
        tt.deepEqual(result, expected);
        tt.end();
    });
}
