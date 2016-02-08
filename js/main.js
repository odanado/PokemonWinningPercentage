var $ = require('jquery');
var translation = require('./translation.js');
$(function() {

    function addMove(text, select) {
        var move = $(text).val();
        var id = translation.toId('move', move);
        // よくわからない技
        if (id === null) return;
        
        $(text).attr('readonly', true);
        
        var tag = "";
        tag += "<option value='" + id + "'>";
        tag += move;
        tag += "</option>";
        $(select).append(tag);
    }
    
    $('fieldset#myPokemon div.moves button').on('click', function(event){
        var num = event.target.id.slice(-1);
        addMove('fieldset#myPokemon div.moves input#moveText' + num, '#myMoves');
    });
    
    $('fieldset#oppPokemon div.moves button').on('click', function(event){
        var num = event.target.id.slice(-1);
        addMove('fieldset#oppPokemon div.moves input#moveText' + num, '#oppMoves');
    });
    
});