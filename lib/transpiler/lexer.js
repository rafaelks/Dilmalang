'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// lexer.js
var Lexer = function () {
	function Lexer(code) {
		_classCallCheck(this, Lexer);

		this.code = code;

		this.removeComments();

		this.printWithLineNumbers();
	}

	_createClass(Lexer, [{
		key: 'replace',
		value: function replace(regex, pattern) {
			this.code = this.code.replace(regex, pattern);
		}
	}, {
		key: 'removeComments',
		value: function removeComments() {
			this.replace(/\/\/.*/g, '');
			this.replace(/\/\*\*[\s\S]*?\*\//g, function (match) {
				return Array.apply(null, { length: match.split('\n').length }).map(function () {
					return '\n';
				}).join('');
			});
		}
	}, {
		key: 'print',
		value: function print() {
			console.log(this.code);
		}
	}, {
		key: 'printWithLineNumbers',
		value: function printWithLineNumbers() {
			var code = this.code.split('\n');
			for (var i = 0; i < code.length; i++) {
				console.log(String(i), code[i]);
			}
		}
	}]);

	return Lexer;
}();

module.exports = Lexer;