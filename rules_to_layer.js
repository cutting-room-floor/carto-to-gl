module.exports = function(ruleGroup) {
    var rules = ruleGroup[0].rules;
    var layer = {
        layout: {},
        paint: {}
    };
    layer.type = rules[0].name.split('-')[0];
    for (var i = 0; i < rules.length; i++) {
        layer.paint[rules[i].name] = rules[i].value.ev({}).toString();
    }
    return layer;
};
