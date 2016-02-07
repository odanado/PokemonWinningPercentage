function makeArray(dict) {
    var ret = [];
    for (var key in dict) if (dict.hasOwnProperty(key)) {
        ret.push(dict[key]);
    }
    return ret;
}
$(document).ready(function(){
    $(".name").autocomplete({
        source: makeArray(dictionary["pokemon"]),
        messages: {
            noResults: '',
            results: function() {}
        }
    });
    $(".ability").autocomplete({
        source: makeArray(dictionary["ability"]),
        messages: {
            noResults: '',
            results: function() {}
        }
    });
    $(".item").autocomplete({
        source: makeArray(dictionary["item"]),
        messages: {
            noResults: '',
            results: function() {}
        }
    });
    $(".move").autocomplete({
        source: makeArray(dictionary["move"]),
        messages: {
            noResults: '',
            results: function() {}
        }
    });
    
    for (var key in dictionary["nature"]) if (dictionary["nature"].hasOwnProperty(key)) {
        var tag = "";
        tag += "<option value='" + key + "'>";
        tag += dictionary["nature"][key];
        tag += "</option>";
        $(".nature").append(tag);
    }
    
});
