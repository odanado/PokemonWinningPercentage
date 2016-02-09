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
    
    function clearMoves() {
        $('div.moves input[id^=moveText]').each(function(idx, text) {
           $(text).attr('readonly', false); 
        });
        
        $('#myMoves').find('option').remove();
        $('#oppMoves').find('option').remove();
    }
    
    $('button#clear').on('click', function () {
        clearMoves();
    });
    
    function getStats(id) {
        var ret = {};
        var statsNames = ["hp", "atk", "def", "spa", "spd", "spe", "accuracy", "evasion"];
        var tag = 'div#' + id + ' input[type=number].';
        for (var i = 0; i < statsNames.length; i++) {
            ret[statsNames[i]] = $(tag + statsNames[i]).val();
        }
        
        return ret;
    }
    
    function makePokemon(side) {
        var p = {};
        var toId = translation.toId;
        p['species'] = toId('pokemon', $('fieldset#' + side + 'Pokemon .name').val());
        p['ability'] = toId('ability', $('fieldset#' + side + 'Pokemon .ability').val());
        p['item']    = toId('item', $('fieldset#' + side + 'Pokemon .item').val());
        p['level']   = $('fieldset#' + side + 'Pokemon .level').val();
        p['nature']  = $('fieldset#' + side + 'Pokemon .nature').val();
        p['ivs']     = getStats(side + 'IVTab');
        p['evs']     = getStats(side + 'EVTab');
        
        p['moves'] = [];
        $('fieldset#' + side + 'Pokemon div.moves input').each(function(i, text) {
            p['moves'].push(toId('move', $(text).val()));
        });
        
        return p;
    }
    
    function validInput() {
        return true;
    }
    
    $('button#calculate').on('click', function () {
        if(!validInput()) {
            return;
        }
        var p1 = makePokemon("my");
        var p2 = makePokemon("opp");
    });
});