var carto = require('carto'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

var layerToSource = require('./layer_to_source');
var rulesToLayer = require('./rules_to_layer');

module.exports = function(mml) {
    var m = loadMML(mml);
    var thisEnv = {};
    var env = _(thisEnv).defaults({
        benchmark: false,
        validation_data: false,
        effects: [],
        ppi: 90.714
    });

    carto.tree.Reference.setVersion('3.0.0');

    var output = {
        sources: {},
        layers: []
    };

    // Transform stylesheets into definitions.
    var definitions = _(m.Stylesheet).chain()
        .map(function(s) {
            if (typeof s === 'string') {
                throw new Error('Stylesheet object is expected not a string: ' + s);
            }
            // Passing the environment from stylesheet to stylesheet,
            // allows frames and effects to be maintained.
            env = _(env).extend({filename:s.id});

            var time = +new Date(),
                root = (carto.Parser(env)).parse(s.data);
            if (env.benchmark)
                console.warn('Parsing time: ' + (new Date() - time) + 'ms');
            return root.toList(env);
        })
        .flatten()
        .value();

    function appliesTo(name, classIndex) {
        return function(definition) {
            return definition.appliesTo(l.name, classIndex);
        };
    }

    // Iterate through layers and create styles custom-built
    // for each of them, and apply those styles to the layers.
    var styles, l, classIndex, rules, sorted, matching;
    for (var i = 0; i < m.Layer.length; i++) {
        l = m.Layer[i];
        styles = [];
        classIndex = {};

        if (env.benchmark) console.warn('processing layer: ' + l.id);
        // Classes are given as space-separated alphanumeric strings.
        var classes = (l['class'] || '').split(/\s+/g);
        for (var j = 0; j < classes.length; j++) {
            classIndex[classes[j]] = true;
        }
        matching = definitions.filter(appliesTo(l.name, classIndex));
        rules = carto.inheritDefinitions(matching, env);
        sorted = carto.sortStyles(rules, env);

        for (var k = 0, rule, style_name; k < sorted.length; k++) {
            rule = sorted[k];
            style_name = l.name + (rule.attachment !== '__default__' ? '-' + rule.attachment : '');
            output.layers.push(rulesToLayer(rule));
        }

        var source = layerToSource(l);
        output.sources[source.id] = source.value;
    }

    // Exit on errors.
    if (env.errors) throw env.errors;

    return output;
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
