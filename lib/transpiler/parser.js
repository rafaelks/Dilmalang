'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     -> prog
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     prog = loop | if | expression | function | call | declaration
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     declaration = politico attribution
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     returnableProg = return prog
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     value = string | number | bool | function | call | expression
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     condition = == | <= | < | >= | > | !==
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     attribution = var = value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     expression = value condition value | !*value | value++ | value-- | value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     if = porque (expression) { prog }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     separator = .,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     loop = euViVoceVeja (attribution separator expression separator expression) { prog }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     function = secretaria id(params) { returnableProg }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     params = (id(,\s*)?)*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     values = (value(,\s*)?)*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     call = id(values)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _pad = require('pad');

var _pad2 = _interopRequireDefault(_pad);

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LexerControl = function () {
	function LexerControl(lexer) {
		_classCallCheck(this, LexerControl);

		this.lexer = lexer;
	}

	_createClass(LexerControl, [{
		key: 'next',
		value: function next() {
			return this.lexer.tokens.shift();
		}
	}, {
		key: 'current',
		get: function get() {
			return this.lexer.tokens[0];
		}
	}, {
		key: 'eof',
		get: function get() {
			return this.lexer.tokens.length === 0;
		}
	}]);

	return LexerControl;
}();

var Parser = function () {
	function Parser(lexer) {
		_classCallCheck(this, Parser);

		if (typeof lexer === 'string') {
			this.lexer = new _lexer2.default(lexer);
		} else {
			this.lexer = lexer;
		}

		this.lexerControl = new LexerControl(this.lexer);
	}

	_createClass(Parser, [{
		key: 'parse',
		value: function parse() {
			return this.program = this.parse_prog();
		}
	}, {
		key: 'print',
		value: function print() {
			console.log(JSON.stringify(this.program, null, 2));
		}
	}, {
		key: 'next',
		value: function next() {
			return this.lexerControl.next();
		}
	}, {
		key: 'unexpected',
		value: function unexpected(token) {
			this.print();
			console.log(this.current.code);
			console.log((0, _pad2.default)(this.current.column, '^'));
			throw new Error('Unexpected token: ' + JSON.stringify(this.current.token) + (', expected ' + token + ' at ' + this.current.line + ':' + this.current.column));
			// console.error('Unexpected token:', JSON.stringify(this.current.token), `${this.current.line}:${this.current.column}`);
			// process.exit();
		}
	}, {
		key: 'isType',
		value: function isType(type, token) {
			if (!Array.isArray(type)) {
				type = [type];
			}

			if (type.includes(this.current.type)) {
				return !token || this.current.token === token;
			}

			return false;
		}
	}, {
		key: 'expectType',
		value: function expectType(type, token) {
			if (this.isType(type, token)) {
				return true;
			}

			this.unexpected(token);
		}
	}, {
		key: 'isPunctuation',
		value: function isPunctuation(token) {
			return this.isType('punctuation', token);
		}
	}, {
		key: 'expectPunctuation',
		value: function expectPunctuation(token) {
			return this.expectType('punctuation', token);
		}
	}, {
		key: 'skipOptionalPontuation',
		value: function skipOptionalPontuation(token) {
			if (this.isPunctuation(token)) {
				this.next();
			}
		}
	}, {
		key: 'skipExpectedPontuation',
		value: function skipExpectedPontuation(token) {
			if (this.expectPunctuation(token)) {
				this.next();
			}
		}
	}, {
		key: 'expectOperation',
		value: function expectOperation(token) {
			return this.expectType('operation', token);
		}
	}, {
		key: 'parse_prog',
		value: function parse_prog() {
			var prog = [];

			while (!this.eof && this['parse_' + this.current.token]) {
				var parser = 'parse_' + this.current.token;
				this.next();
				prog.push(this[parser]());
			}

			return {
				type: 'prog',
				prog: prog
			};
		}
	}, {
		key: 'parse_variable',
		value: function parse_variable() {
			var token = this.current.token;

			this.expectType('var');
			this.next();

			return token;
		}
	}, {
		key: 'parse_value',
		value: function parse_value() {
			var current = this.current;
			if (this.expectType(['number', 'boolean', 'string', 'var'])) {
				this.next();
				var result = {
					type: current.type
				};

				switch (current.type) {
					case 'number':
						result.value = parseFloat(current.token);
						break;

					case 'string':
						result.value = current.token.replace(/^['"]|['"]$/g, '');
						break;

					case 'boolean':
						result.value = current.token === 'true';
						break;
				}

				return result;
			}

			this.unexpected(current.token);
		}
	}, {
		key: 'parse_expression',
		value: function parse_expression() {
			var result = this.parse_value();

			var token = this.current.token;
			if (this.isType('operation')) {
				this.next();

				result = {
					type: 'operation',
					operation: token,
					left: result
				};

				if (token !== '++' && token !== '--') {
					result.right = this.parse_expression();
				}
			}

			return result;
		}
	}, {
		key: 'parse_politico',
		value: function parse_politico() {
			var variable = this.parse_variable();

			this.expectOperation('=');
			this.next();

			var expression = this.parse_expression();
			this.skipOptionalPontuation('.,');

			return {
				type: 'declaration',
				name: variable,
				value: expression
			};
		}
	}, {
		key: 'parse_porque',
		value: function parse_porque() {
			this.skipExpectedPontuation('(');

			var condition = this.parse_expression();

			this.skipExpectedPontuation(')');
			this.skipExpectedPontuation('{');

			var then = this.parse_prog();

			this.skipExpectedPontuation('}');

			var result = {
				type: 'condition',
				condition: condition,
				then: then
			};

			if (this.current.token === 'casoContrario') {
				this.next();
				this.skipExpectedPontuation('{');

				result.else = this.parse_prog();

				this.skipExpectedPontuation('}');
			}

			return result;
		}
	}, {
		key: 'parse_euViVoceVeja',
		value: function parse_euViVoceVeja() {
			this.skipExpectedPontuation('(');

			var initialization = this.parse_expression();

			this.skipExpectedPontuation('.,');

			var condition = this.parse_expression();

			this.skipExpectedPontuation('.,');

			var finalExpression = this.parse_expression();

			this.skipExpectedPontuation(')');
			this.skipExpectedPontuation('{');

			var statement = this.parse_prog();

			this.skipExpectedPontuation('}');

			return {
				type: 'loop',
				initialization: initialization,
				condition: condition,
				finalExpression: finalExpression,
				statement: statement
			};
		}
	}, {
		key: 'parse_values',
		value: function parse_values() {
			return this.parse_expression();
		}
	}, {
		key: 'parse_midiaGolpista',
		value: function parse_midiaGolpista() {
			this.skipExpectedPontuation('(');

			var result = {
				type: 'print'
			};

			if (!this.isType('punctuation', ')')) {
				result.values = this.parse_values();
			}

			this.skipExpectedPontuation(')');

			this.skipOptionalPontuation('.,');

			return result;
		}
	}, {
		key: 'parse_pareiDeVer',
		value: function parse_pareiDeVer() {
			var result = {
				type: 'break'
			};

			this.skipOptionalPontuation('.,');

			return result;
		}
	}, {
		key: 'parse_euJaVi',
		value: function parse_euJaVi() {
			var result = {
				type: 'continue'
			};

			this.skipOptionalPontuation('.,');

			return result;
		}
	}, {
		key: 'current',
		get: function get() {
			return this.lexerControl.current;
		}
	}, {
		key: 'eof',
		get: function get() {
			return this.lexerControl.eof;
		}
	}]);

	return Parser;
}();

exports.default = Parser;