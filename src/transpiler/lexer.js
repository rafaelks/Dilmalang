import pad from 'pad';

// lexer.js
class Cleaner {
	clean(code) {
		const original = code;
		const clean = this.removeComments(code);
		const parsed = this.parseAsArray(clean);

		return {original, clean, parsed};
	}

	removeComments(code) {
		code = code.replace(/\/\/.*/g, '');
		code = code.replace(/\/\*\*[\s\S]*?\*\//g, function(match) {
			return Array.apply(null, {length: match.split('\n').length}).map(() => '\n').join('');
		});
		code = code.replace(/\t/g, '  ');

		return code;
	}

	parseAsArray(code) {
		const arr = [];
		code = code.split('\n');
		for (let i = 0; i < code.length; i++) {
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
}

const cleaner = new Cleaner();

class LineControl {
	constructor(lexer) {
		this.lexer = lexer;
	}

	get index() {
		return this.current.line;
	}

	next() {
		this.current.line++;
		return this.lexer.code.parsed.shift();
	}

	get current() {
		return this.lexer.code.parsed[0];
	}

	get eof() {
		return this.lexer.code.parsed.length === 0;
	}
}

class CharControl {
	constructor(lexer) {
		this.lexer = lexer;
	}

	get index() {
		return this.lexer.line.current.column;
	}

	indexAdd() {
		this.lexer.line.current.column++;
	}

	next() {
		this.lexer.line.current.column++;
		this.lexer.line.current.code = this.lexer.line.current.code.substr(1);
		return this.lexer.line.current.code[0];
	}

	seeNext(n = 1) {
		return this.lexer.line.current.code.substr(1, n);
	}

	get current() {
		return this.lexer.line.current.code[0];
	}

	get eof() {
		return this.lexer.line.current.code.length === 0;
	}

	get nextEof() {
		return this.lexer.line.current.code.length === 1;
	}
}

class Lexer {
	constructor(code) {
		this.code = cleaner.clean(code);

		this.ids = [
			'ministerio',
			'cc',
			'secretaria',
			'dobrarAMeta',
			'porque',
			'casoContrario',
			'politico',
			'estocarVento',
			'figuraOculta',
			'midiaGolpista',
			'propina',
			'laranja',
			'corrupto',
			'honesto',
			'carater',
			'tentar',
			'lavaJato',
			'pedalada',
			'delatar',
			'euViVoceVeja',
			'euJaVi',
			'pareiDeVer',
			'meta',
			'jogaPraDentro'
		];

		this.line = new LineControl(this);
		this.char = new CharControl(this);
		// console.log(this.code.parsed);

		this.rules = [
			{
				type: 'string',
				testInitial: (char) => {
					return /["']/.test(char);
				},
				testEnd: (char, token) => {
					return /[^\\]["']$/.test(token);
				}
			}, {
				type: 'boolean',
				testInitial: (char) => {
					return /[tf]/.test(char);
				},
				testEnd: (char, token) => {
					return /^(true|false)$/.test(token);
				}
			}, {
				type: 'number',
				testInitial: (char) => {
					return /[0-9]/.test(char);
				},
				testEnd: (char) => {
					const nextTwoChar = this.char.seeNext(2);
					if (nextTwoChar === '.,') {
						return true;
					}

					if (char === '.') {
						return /[^\.0-9]/.test(nextTwoChar);
					}

					return /[^0-9\.]/.test(char);
				}
			}, {
				type: 'id',
				testInitial: (char) => {
					return /[a-zA-Z$]/.test(char);
				},
				testEnd: (char) => {
					return /[^a-zA-Z0-9-_$]/.test(char);
				},
				getType: (token) => {
					if (this.ids.includes(token)) {
						return 'id';
					}
					return 'var';
				}
			}, {
				type: 'operation',
				testInitial: (char) => {
					return /[-+*/%=&|<>!]/.test(char);
				},
				testEnd: (char) => {
					return !/[-+*/%=&|<>!]/.test(char);
				}
			}, {
				type: 'punctuation',
				testInitial: (char) => {
					return /[,.{}()\[\]]/.test(char);
				},
				testEnd: (char, token) => {
					if (token === '.') {
						return /[^,]/.test(char);
					}

					return true;
				}
			}
		];

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

	print() {
		const typeColumnSize = 15;
		const tokenColumnSize = 45;
		const codeColumnSize = 72;
		const totalColumnSize = typeColumnSize + tokenColumnSize + codeColumnSize + 20;
		let currentLine = -1;
		console.log('+', pad('', totalColumnSize, '-'), '+');
		console.log('|', pad('line', 4), '|', pad('col', 4), '|', pad('type', typeColumnSize), '|', pad('token', tokenColumnSize), '|', pad('code', codeColumnSize), '|');

		for (const {type, token, line, column, code} of this.tokens) {
			if (line !== currentLine) {
				console.log('+', pad('', totalColumnSize, '-'), '+');
				currentLine = line;
			}
			console.log('|', pad(String(line), 4), '|', pad(String(column), 4), '|', pad(type, typeColumnSize), '|', pad(token, tokenColumnSize), '|', pad(code, codeColumnSize), '|');
		}

		console.log('+', pad('', totalColumnSize, '-'), '+');
	}

	processChar(char) {
		let token;
		for (const rule of this.rules) {
			if (rule.testInitial(char) === true) {
				// console.log(char, rule);
				token = this.read(rule, char);
				break;
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

	read(rule, char) {
		let token = char;
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
}

export default Lexer;
