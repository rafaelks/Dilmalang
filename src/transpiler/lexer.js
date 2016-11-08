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

	next() {
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

	next() {
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

		this.line = new LineControl(this);
		this.char = new CharControl(this);
		// console.log(this.code.parsed);

		this.rules = [
			{
				type: 'id',
				testInitial: (char) => {
					return /[a-zA-Z$]/.test(char);
				},
				testEnd: (char) => {
					return /[^a-zA-Z0-9-_$]/.test(char);
				}
			}, {
				type: 'string',
				testInitial: (char) => {
					return /["']/.test(char);
				},
				testEnd: (char, token) => {
					return /[^\\]["']$/.test(token);
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

		while (!this.line.eof) {
			const tokens = [];
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

	printTokens(tokens) {
		const typeColumnSize = 20;
		const tokenColumnSize = 40;
		console.log('');
		console.log(this.line.current.original);
		console.log('+', pad('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
		console.log('|', pad('type', typeColumnSize), '|', pad('token', tokenColumnSize), '|');
		console.log('+', pad('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
		for (const token of tokens) {
			if (token) {
				console.log('|', pad(token.type, typeColumnSize), '|', pad(token.token, tokenColumnSize), '|');
			} else {
				console.log('|', pad('-', typeColumnSize), '|', pad('-', tokenColumnSize), '|');
			}
		}
		console.log('+', pad('', typeColumnSize + tokenColumnSize + 3, '-'), '+');
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
			type: rule.type,
			token: token
		};
	}
}

module.exports = Lexer;
