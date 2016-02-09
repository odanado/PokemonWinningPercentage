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
            var move = toId('move', $(text).val());
            if (move)
                p['moves'].push(move);
        });
        
        return p;
    }
    
    function makeMoves(side) {
        var moves = [];
        $("#" + side + "Moves").find("option").each(function(i, opt) {
            moves.push($(opt).val());
        });
        return moves;
    }
    
    function validInput() {
        var toId = translation.toId;
        var sides = ["my", "opp"];
        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var name = $('fieldset#' + side + 'Pokemon .name').val();
            if (!toId('pokemon', name)) {
                alert("ポケモン名 " + name + " が不正です。");
                return false;
            }
            var ability = $('fieldset#' + side + 'Pokemon .ability').val();
            if (!toId('ability', ability)) {
                alert("特性 " + ability + " が不正です。");
                return false;
            }
            var item = $('fieldset#' + side + 'Pokemon .item').val();
            if (!toId('item', item)) {
                alert("持ち物 " + item + " が不正です。");
                return false;
            }
            $('fieldset#' + side + 'Pokemon div.moves input').each(function(i, text) {
                var move = $(text).val();
                if (move !== "" && !toId('move', move)) {
                    alert("技名 " + move + " が不正です。");
                    return false;
                }
            });
        }
        return true;
    }
    
    $('button#calculate').on('click', function () {
        if(!validInput()) {
            return;
        }
        var p1 = makePokemon("my");
        var p2 = makePokemon("opp");
        var move1 = makeMoves("my");
        var move2 = makeMoves("opp");
        
        if (move1.length !== move2.length) {
            alert("両者の技の数を同じにしてください。");
            return;
        }
    });
});