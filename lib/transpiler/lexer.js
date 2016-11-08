'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pad = require('pad');

var _pad2 = _interopRequireDefault(_pad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// lexer.js
var Cleaner = function () {
	function Cleaner() {
		_classCallCheck(this, Cleaner);
	}

	_createClass(Cleaner, [{
		key: 'clean',
		value: function clean(code) {
			var original = code;
			var clean = this.removeComments(code);
			var parsed = this.parseAsArray(clean);

			return { original: original, clean: clean, parsed: parsed };
		}
	}, {
		key: 'removeComments',
		value: function removeComments(code) {
			code = code.replace(/\/\/.*/g, '');
			code = code.replace(/\/\*\*[\s\S]*?\*\//g, function (match) {
				return Array.apply(null, { length: match.split('\n').length }).map(function () {
					return '\n';
				}).join('');
			});
			code = code.replace(/\t/g, '  ');

			return code;
		}
	}, {
		key: 'parseAsArray',
		value: function parseAsArray(code) {
			var arr = [];
			code = code.split('\n');
			for (var i = 0; i < code.length; i++) {
				if (code[i].trim() !== '') {
					arr.push({
						line: i,
						column: code[i].match(/^\s*/)[0].length,
						code: code[i].replace(/^\s*/, ''),
						original: code[i]
					});
				}
			}

			return arr;
		}

		// print() {
		// 	console.log(this.code);
		// }

		// printWithLineNumbers() {
		// 	const code = this.code.split('\n');
		// 	for (let i = 0; i < code.length; i++) {
		// 		console.log(String(i), code[i]);
		// 	}
		// }

	}]);

	return Cleaner;
}();

var cleaner = new Cleaner();

var LineControl = function () {
	function LineControl(lexer) {
		_classCallCheck(this, LineControl);

		this.lexer = lexer;
	}

	_createClass(LineControl, [{
		key: 'next',
		value: function next() {
			return this.lexer.code.parsed.shift();
		}
	}, {
		key: 'current',
		get: function get() {
			return this.lexer.code.parsed[0];
		}
	}, {
		key: 'eof',
		get: function get() {
			return this.lexer.code.parsed.length === 0;
		}
	}]);

	return LineControl;
}();

var CharControl = function () {
	function CharControl(lexer) {
		_classCallCheck(this, CharControl);

		this.lexer = lexer;
	}

	_createClass(CharControl, [{
		key: 'next',
		value: function next() {
			this.lexer.line.current.code = this.lexer.line.current.code.substr(1);
			return this.lexer.line.current.code[0];
		}
	}, {
		key: 'seeNext',
		value: function seeNext() {
			var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

			return this.lexer.line.current.code.substr(1, n);
		}
	}, {
		key: 'current',
		get: function get() {
			return this.lexer.line.current.code[0];
		}
	}, {
		key: 'eof',
		get: function get() {
			return this.lexer.line.current.code.length === 0;
		}
	}, {
		key: 'nextEof',
		get: function get() {
			return this.lexer.line.current.code.length === 1;
		}
	}]);

	return CharControl;
}();

var Lexer = function () {
	function Lexer(code) {
		var _this = this;

		_classCallCheck(this, Lexer);

		this.code = cleaner.clean(code);

		this.line = new LineControl(this);
		this.char = new CharControl(this);
		// console.log(this.code.parsed);

		this.rules = [{
			type: 'id',
			testInitial: function testInitial(char) {
				return (/[a-zA-Z$]/.test(char)
				);
			},
			testEnd: function testEnd(char) {
				return (/[^a-zA-Z0-9-_$]/.test(char)
				);
			}
		}, {
			type: 'string',
			testInitial: function testInitial(char) {
				return (/["']/.test(char)
				);
			},
			testEnd: function testEnd(char, token) {
				return (/[^\\]["']$/.test(token)
				);
			}
		}, {
			type: 'number',
			testInitial: function testInitial(char) {
				return (/[0-9]/.test(char)
				);
			},
			testEnd: function testEnd(char) {
				var nextTwoChar = _this.char.seeNext(2);
				if (nextTwoChar === '.,') {
					return true;
				}

				if (char === '.') {
					return (/[^\.0-9]/.test(nextTwoChar)
					);
				}

				return (/[^0-9\.]/.test(char)
				);
			}
		}, {
			type: 'operation',
			testInitial: function testInitial(char) {
				return (/[-+*/%=&|<>!]/.test(char)
				);
			},
			testEnd: function testEnd(char) {
				return !/[-+*/%=&|<>!]/.test(char);
			}
		}, {
			type: 'punctuation',
			testInitial: function testInitial(char) {
				return (/[,.{}()\[\]]/.test(char)
				);
			},
			testEnd: function testEnd(char, token) {
				if (token === '.') {
					return (/[^,]/.test(char)
					);
				}

				return true;
			}
		}];

		while (!this.line.eof) {
			var tokens = [];
			while (!this.char.eof) {
				if (this.char.current !== ' ') {
					tokens.push(this.processChar(this.char.current));
				}
				this.char.next();
			}
			this.printTokens(tokens);

			this.line.next();
		}

		console.log('END');
	}

	_createClass(Lexer, [{
		key: 'printTokens',
		value: function printTokens(tokens) {
			var typeColumnSize = 20;
			var tokenColumnSize = 40;
			console.log('');
			console.log(this.line.current.original);
			console.log('+', (0, _pad2.default)('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
			console.log('|', (0, _pad2.default)('type', typeColumnSize), '|', (0, _pad2.default)('token', tokenColumnSize), '|');
			console.log('+', (0, _pad2.default)('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var token = _step.value;

					if (token) {
						console.log('|', (0, _pad2.default)(token.type, typeColumnSize), '|', (0, _pad2.default)(token.token, tokenColumnSize), '|');
					} else {
						console.log('|', (0, _pad2.default)('-', typeColumnSize), '|', (0, _pad2.default)('-', tokenColumnSize), '|');
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			console.log('+', (0, _pad2.default)('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
		}
	}, {
		key: 'processChar',
		value: function processChar(char) {
			var token = void 0;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.rules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var rule = _step2.value;

					if (rule.testInitial(char) === true) {
						// console.log(char, rule);
						token = this.read(rule, char);
						break;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			if (!token) {
				token = {
					type: '-',
					token: char
				};
			}

			return token;
		}
	}, {
		key: 'read',
		value: function read(rule, char) {
			var token = char;
			while (!this.char.nextEof) {
				if (rule.testEnd(this.char.seeNext(), token) === false) {
					token += this.char.next();
				} else {
					break;
				}
			}

			return {
				type: rule.type,
				token: token
			};
		}
	}]);

	return Lexer;
}();

module.exports = Lexer;