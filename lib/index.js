'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lexer = require('./transpiler/lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./transpiler/parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let fileContent = fs.readFileSync('Example.dilmalang');
var fileContent = _fs2.default.readFileSync('Example - Loop.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

var lexer = new _lexer2.default(fileContent);
lexer.printTokens();

new _parser2.default(lexer);