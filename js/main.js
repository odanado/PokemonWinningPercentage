var $ = require('jquery');
var translation = require('./translation.js');

const noop = function () {};
process.send = noop;
var BattleEngine = require('../Pokemon-ShowDown/battle-engine.js');

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
            ret[statsNames[i]] = Number($(tag + statsNames[i]).val());
        }
        
        return ret;
    }
    
    function makePokemon(side) {
        var p = {};
        var toId = translation.toId;
        p['species'] = toId('pokemon', $('fieldset#' + side + 'Pokemon .name').val());
        p['ability'] = toId('ability', $('fieldset#' + side + 'Pokemon .ability').val());
        p['item']    = toId('item', $('fieldset#' + side + 'Pokemon .item').val());
        p['level']   = Number($('fieldset#' + side + 'Pokemon .level').val());
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
    
    function updateprogressBar(nowCount, playCount) {
        var percent = (100.0 * nowCount / playCount).toFixed(0) + '%';
        $('.progress-bar').width(percent);
        $('.progress-bar').text('進捗: ' + percent);
    }
    
    var prob1 = [], prob2 = [];
    var min, max;
    function simulate(playCount, p1, p2, move1, move2) {
        
        for (var i = 0; i < playCount; i++) {
            var battle = BattleEngine.Battle.construct();
        
            battle.join('p1', 'Guest 1', 1, [p1]);
            battle.join('p2', 'Guest 2', 1, [p2]);
            
            battle.p1.active[0].boostBy(getStats("myBoostTab"));
            battle.p2.active[0].boostBy(getStats("oppBoostTab"));
            
            for (var j = 0; j < move1.length; j++) {
                battle.choose('p1', 'move ' + move1[j]);
                battle.choose('p2', 'move ' + move2[j]);
            }
            
            var hp1 = battle.p1.pokemon[0].hp;
            var hp2 = battle.p2.pokemon[0].hp;
            prob1[hp1] = prob1[hp1] || 0;
            prob2[hp2] = prob2[hp2] || 0;
            
            prob1[hp1] += 1;
            prob2[hp2] += 1;
            min = Math.min(min, hp1);
            min = Math.min(min, hp2);
            max = Math.max(max, hp1);
            max = Math.max(max, hp2);
        }
        
    }
    
    function writeResult(ret) {
        var text = "";
        text += $("#myPokemon .name").val() + "HP確率分布\n";
        text += "残りHP: その確率\n";
        var prob1 = ret[0], prob2 = ret[1];
        var min = ret[2];
        var max = ret[3];
        for (var i = min; i <= max; i++) {
            if (prob1[i])
                text += i + ': ' + (prob1[i] * 100).toFixed(0) + '%\n';
        }
        
        $("#resultText").val(text);
        isCalculating = false;
    }
    
    
    function run(p1, p2, move1, move2) {
        prob1 = [];
        prob2 = [];
        min = 1000;
        max = 0;
        var counter = 0;
        var loopCount = Number($('#loopCount').val());
        
        (function callback() {
            if (counter == loopCount) {
                
                for (var i = min; i <= max; i++) {
                    if (prob1[i])
                        prob1[i] /= 100.0 * loopCount;
                    if (prob2[i])
                        prob2[i] /= 100.0 * loopCount;
                }
                writeResult([prob1, prob2, min, max]);
                return;
            }
           simulate(100, p1, p2, move1, move2);
           updateprogressBar(counter+1, loopCount);
           counter += 1;
           
           setTimeout(callback, 0);
        })();
        
    }
    
    var isCalculating = false;
    
    $('button#calculate').on('click', function () {
        
        if(!validInput()) {
            return;
        }
        if (isCalculating) {
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
        isCalculating = true;
        $("#resultText").val("計算中...");
        
        setTimeout(function(){ run(p1, p2, move1, move2); }, 0);
    });
});