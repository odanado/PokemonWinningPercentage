var assert = require('assert');
var translation = require('../js/translation.js');
 
describe('translation', function () {
    describe('toJa', function () {
        it('idから日本語への変換ができていること', function () {
            assert.equal(translation.toJa('pokemon', 'kangaskhan'), 'ガルーラ');
            assert.equal(translation.toJa('item', 'Assault Vest'), 'とつげきチョッキ');
            assert.equal(translation.toJa('move', 'Draco Meteor'), 'りゅうせいぐん');
            assert.equal(translation.toJa('ability', 'Parental Bond'), 'おやこあい');
            
        });
    });
});
describe('translation', function () {
    describe('toId', function () {
        it('日本語からidへの変換ができていること', function () {
            assert.equal(translation.toId('pokemon', 'ガルーラ'), 'kangaskhan');
            assert.equal(translation.toId('item', 'とつげきチョッキ'), 'assaultvest');
            assert.equal(translation.toId('move', 'りゅうせいぐん'), 'dracometeor');
            assert.equal(translation.toId('ability', 'おやこあい'), 'parentalbond');
            
            assert.equal(translation.toId('pokemon', 'おやこあい'), null);
            
        });
    });
});