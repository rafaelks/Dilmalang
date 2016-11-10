/*
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

import pad from 'pad';

class LexerControl {
	constructor(lexer) {
		this.lexer = lexer;
	}

	next() {
		return this.lexer.tokens.shift();
	}

	get current() {
		return this.lexer.tokens[0];
	}

	get eof() {
		return this.lexer.tokens.length === 0;
	}
}

class Parser {
	constructor(lexer) {
		this.lexer = new LexerControl(lexer);

		this.program = this.parse_prog();

		this.print();
	}

	print() {
		console.log(JSON.stringify(this.program, null, 2));
	}

	get current() {
		return this.lexer.current;
	}

	get eof() {
		return this.lexer.eof;
	}

	next() {
		return this.lexer.next();
	}

	unexpected(token) {
		this.print();
		console.log(this.current.code);
		console.log(pad(this.current.column, '^'));
		throw new Error('Unexpected token: ' + JSON.stringify(this.current.token) + `, expected ${token} at ${this.current.line}:${this.current.column}`);
		// console.error('Unexpected token:', JSON.stringify(this.current.token), `${this.current.line}:${this.current.column}`);
		// process.exit();
	}

	isType(type, token) {
		if (!Array.isArray(type)) {
			type = [type];
		}

		if (type.includes(this.current.type)) {
			return !token || this.current.token === token;
		}

		return false;
	}

	expectType(type, token) {
		if (this.isType(type, token)) {
			return true;
		}

		this.unexpected(token);
	}

	isPunctuation(token) {
		return this.isType('punctuation', token);
	}

	expectPunctuation(token) {
		return this.expectType('punctuation', token);
	}

	skipOptionalPontuation(token) {
		if (this.isPunctuation(token)) {
			this.next();
		}
	}

	skipExpectedPontuation(token) {
		if (this.expectPunctuation(token)) {
			this.next();
		}
	}

	expectOperation(token) {
		return this.expectType('operation', token);
	}

	parse_prog() {
		const prog = [];

		while (!this.eof && this[`parse_${this.current.token}`]) {
			const parser = `parse_${this.current.token}`;
			this.next();
			prog.push(this[parser]());
		}

		return {
			type: 'prog',
			prog
		};
	}

	parse_variable() {
		const token = this.current.token;

		this.expectType('var');
		this.next();

		return token;
	}

	parse_value() {
		const token = this.current.token;
		if (this.expectType(['number', 'var', 'string'])) {
			this.next();
			return token;
		}

		this.unexpected(token);
	}

	parse_expression() {
		let result = this.parse_value();

		const token = this.current.token;
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

	parse_politico() {
		const variable = this.parse_variable();

		this.expectOperation('=');
		this.next();

		const expression = this.parse_expression();
		this.skipOptionalPontuation('.,');

		return {
			type: 'declaration',
			name: variable,
			value: expression
		};
	}

	parse_porque() {
		this.skipExpectedPontuation('(');

		const condition = this.parse_expression();

		this.skipExpectedPontuation(')');
		this.skipExpectedPontuation('{');

		const then = this.parse_prog();

		this.skipExpectedPontuation('}');

		const result = {
			type: 'condition',
			condition,
			then
		};

		if (this.current.token === 'casoContrario') {
			this.next();
			this.skipExpectedPontuation('{');

			result.else = this.parse_prog();

			this.skipExpectedPontuation('}');
		}

		return result;
	}

	parse_euViVoceVeja() {
		this.skipExpectedPontuation('(');

		const initialization = this.parse_expression();

		this.skipExpectedPontuation('.,');

		const condition = this.parse_expression();

		this.skipExpectedPontuation('.,');

		const finalExpression = this.parse_expression();

		this.skipExpectedPontuation(')');
		this.skipExpectedPontuation('{');

		const statement = this.parse_prog();

		this.skipExpectedPontuation('}');

		return {
			type: 'loop',
			initialization,
			condition,
			finalExpression,
			statement
		};
	}

	parse_values() {
		return this.parse_expression();
	}

	parse_midiaGolpista() {
		this.skipExpectedPontuation('(');

		const result = {
			type: 'print'
		};

		if (!this.isType('punctuation', ')')) {
			result.values = this.parse_values();
		}

		this.skipExpectedPontuation(')');

		this.skipOptionalPontuation('.,');

		return result;
	}

	parse_pareiDeVer() {
		const result = {
			type: 'break'
		};

		this.skipOptionalPontuation('.,');

		return result;
	}

	parse_euJaVi() {
		const result = {
			type: 'continue'
		};

		this.skipOptionalPontuation('.,');

		return result;
	}
}

export default Parser;
