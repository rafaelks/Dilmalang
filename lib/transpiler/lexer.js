'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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
			this.current.line++;
			return this.lexer.code.parsed.shift();
		}
	}, {
		key: 'index',
		get: function get() {
			return this.current.line;
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
		key: 'indexAdd',
		value: function indexAdd() {
			this.lexer.line.current.column++;
		}
	}, {
		key: 'next',
		value: function next() {
			this.lexer.line.current.column++;
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
		key: 'index',
		get: function get() {
			return this.lexer.line.current.column;
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

		this.ids = ['ministerio', 'cc', 'secretaria', 'dobrarAMeta', 'porque', 'casoContrario', 'politico', 'estocarVento', 'figuraOculta', 'midiaGolpista', 'propina', 'laranja', 'corrupto', 'honesto', 'carater', 'tentar', 'lavaJato', 'pedalada', 'delatar', 'euViVoceVeja', 'euJaVi', 'pareiDeVer', 'meta', 'jogaPraDentro'];

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
			},
			getType: function getType(token) {
				if (_this.ids.includes(token)) {
					return 'id';
				}
				return 'var';
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

		this.tokens = [];

		while (!this.line.eof) {
			while (!this.char.eof) {
				if (this.char.current !== ' ') {
					this.tokens.push(this.processChar(this.char.current));
				} else {
					this.char.indexAdd();
				}
				this.char.next();
			}

			this.line.next();
		}
	}

	_createClass(Lexer, [{
		key: 'printTokens',
		value: function printTokens() {
			var typeColumnSize = 15;
			var tokenColumnSize = 45;
			var codeColumnSize = 72;
			var totalColumnSize = typeColumnSize + tokenColumnSize + codeColumnSize + 20;
			var currentLine = -1;
			console.log('+', (0, _pad2.default)('', totalColumnSize, '-'), '+');
			console.log('|', (0, _pad2.default)('line', 4), '|', (0, _pad2.default)('col', 4), '|', (0, _pad2.default)('type', typeColumnSize), '|', (0, _pad2.default)('token', tokenColumnSize), '|', (0, _pad2.default)('code', codeColumnSize), '|');

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = _step.value,
					    type = _step$value.type,
					    token = _step$value.token,
					    line = _step$value.line,
					    column = _step$value.column,
					    code = _step$value.code;

					if (line !== currentLine) {
						console.log('+', (0, _pad2.default)('', totalColumnSize, '-'), '+');
						currentLine = line;
					}
					console.log('|', (0, _pad2.default)(String(line), 4), '|', (0, _pad2.default)(String(column), 4), '|', (0, _pad2.default)(type, typeColumnSize), '|', (0, _pad2.default)(token, tokenColumnSize), '|', (0, _pad2.default)(code, codeColumnSize), '|');
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

			console.log('+', (0, _pad2.default)('', totalColumnSize, '-'), '+');
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
					line: '-',
					column: '-',
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
				code: this.line.current.original,
				line: this.line.index + 1,
				column: this.char.index - token.length + 1,
				type: rule.getType ? rule.getType(token) : rule.type,
				token: token
			};
		}
	}]);

	return Lexer;
}();

exports.default = Lexer;