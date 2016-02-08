function toJa(category, id) {
    id = id.toLowerCase().replace(/[^a-z0-9]+/g, '');
    var dict = require("./dictionary.js").dictionary;
    return dict[category][id];
}

function toId(category, name) {
    var dict = require("./dictionary.js").dictionary;
    dict = dict[category];
    
    for (var id in dict) if (dict.hasOwnProperty(id)) {
        if (dict[id] == name) {
            return id;
        }
    }
    return null;
}

exports.toJa = toJa;
exports.toId = toId;