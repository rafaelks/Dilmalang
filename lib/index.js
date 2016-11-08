'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Lexer = require('./transpiler/lexer');

var fileContent = _fs2.default.readFileSync('Example.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

new Lexer(fileContent);