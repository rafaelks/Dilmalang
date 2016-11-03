// lexer.js
class Lexer {
	constructor(code) {
		this.code = code;

		this.removeComments();

		this.printWithLineNumbers();
	}

	replace(regex, pattern) {
		this.code = this.code.replace(regex, pattern);
	}

	removeComments() {
		this.replace(/\/\/.*/g, '');
		this.replace(/\/\*\*[\s\S]*?\*\//g, function(match) {
			return Array.apply(null, {length: match.split('\n').length}).map(() => '\n').join('');
		});
	}

	print() {
		console.log(this.code);
	}

	printWithLineNumbers() {
		const code = this.code.split('\n');
		for (let i = 0; i < code.length; i++) {
			console.log(String(i), code[i]);
		}
	}
}

module.exports = Lexer;
