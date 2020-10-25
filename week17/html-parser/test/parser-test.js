var assert = require('assert');

// var add = require('../add.js').add;
// var mul = require('../add.js').mul;
import {parseHTML} from '../src/parser'

describe("parse html:", () => {
    it('<a></a>', function() {
        let tree = parseHTML('<a></a>');
        // console.log(tree);
        
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    });
    it('<a href="/test"></a>', function() {
        let tree = parseHTML('<a href="/test"></a>');
        // console.log(tree.children[1].attributes);
        
        assert.equal(tree.children[1].attributes[0].name, 'href');
        assert.equal(tree.children[1].attributes[0].value, '/test');
    });
    it('<a href></a>', function() {
        let tree = parseHTML('<a href></a>');
        // console.log(tree);
        
        // assert.equal(tree.children[1].attributes[0].name, 'href');
        // assert.equal(tree.children[1].attributes[0].value, '/test');
    });
    it('<a href id></a>', function() {
        let tree = parseHTML('<a href id></a>');
        // console.log(tree);
    });
    it('<a href="abc" id></a>', function() {
        let tree = parseHTML('<a href="abc" id></a>');
        // console.log(tree);
    });
    it('<a id=abc></a>', function() {
        let tree = parseHTML('<a id=abc></a>');
        // console.log(tree);
    });
    it('<a id=abc />', function() {
        let tree = parseHTML('<a id=abc />');
        // console.log(tree);
    });
    it('<a id=\'abc\' />', function() {
        let tree = parseHTML('<a id=\'abc\' />');
        // console.log(tree);
    });
    it('<a />', function() {
        let tree = parseHTML('<a />');
        // console.log(tree);
    });
    it('<A /> upper case', function() {
        let tree = parseHTML('<A /> upper case');
        // console.log(tree);
    });
    it('<>', function() {
        let tree = parseHTML('<>');
        // console.log(tree);
    });
   


});


