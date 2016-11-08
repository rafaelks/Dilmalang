'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lexer = require('./transpiler/lexer');

var _lexer2 = _interopRequireDefault(_lexer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileContent = _fs2.default.readFileSync('Example.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

new _lexer2.default(fileContent);