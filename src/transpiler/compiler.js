import Parser from './parser';
import pad from 'pad';

class Compiler {
	constructor(parsed) {
		if (typeof parsed === 'string') {
			parsed = new Parser(parsed).parse();
		}

		this.identionLevel = 0;
		this.parsed = parsed;
		this.compiled = '';
		this.compile(this.parsed);
		this.compiled = this.compiled.replace(/\n$/, '');
	}

	indent(string) {
		if (/\n$/.test(this.compiled)) {
			return pad(this.identionLevel, '', '	') + string;
		}

		return string;
	}

	append(string) {
		this.compiled += this.indent(string);
	}

	print() {
		console.log('+--- Result in JavaScript ---+');
		console.log(this.compiled);
		console.log('+-----------  End -----------+');
	}


	// Compile all the code

	compile(object) {
		let type = object.type;

		if (type === 'prog') {
			let program = object.prog;

			for (let smallProgram of program) {
				this.compile(smallProgram);
				if (!/}$/.test(this.compiled)) {
					this.append(';');
				}
				this.append('\n');
			}

		} else if (type === 'declaration') {
			this.compileDeclaration(object);

		} else if (type === 'loop') {
			this.compileLoop(object);

		} else if (type === 'operation') {
			this.compileOperation(object);

		} else if (type === 'condition') {
			this.compileCondition(object);

		} else if (type === 'break') {
			this.compileBreak(object);

		} else if (type === 'continue') {
			this.compileContinue(object);

		} else if (type === 'print') {
			this.compilePrint(object);

		} else if (type === 'string') {
			this.append('\'' + object.value + '\'');

		} else if (type === 'number') {
			this.append(String(object.value));

		} else if (type === 'boolean') {
			this.append(object.value ? 'true' : 'false');
		}

		return this.compiled;
	}


	// Sub Compilers
	compileDeclaration(object) {
		this.append('var ' + object.name);

		if (object.value) {
			this.append(' = ');

			this.compile(object.value);
		}
	}

	compileLoop(object) {
		this.append('for (');

		this.compile(object.initialization);
		this.append('; ');
		this.compile(object.condition);
		this.append('; ');
		this.compile(object.finalExpression);

		this.append(') \{\n');
		this.identionLevel++;

		if (object.statement) {
			this.compile(object.statement);
		}

		this.identionLevel--;
		this.append('}');
	}

	compileBreak() {
		this.append('break');
	}

	compileContinue() {
		this.append('continue');
	}

	compileOperation(object) {
		if (object.left.name) {
			this.append(object.left.name);
		} else {
			this.compile(object.left);
		}

		if (object.right) {
			this.append(' ');
			this.append(object.operation);
			this.append(' ');

			if (object.right.name) {
				this.append(object.right.name);
			} else {
				this.compile(object.right);
			}
		} else {
			this.append(object.operation);
		}
	}

	compileCondition(object) {
		this.append('if (');
		this.compile(object.condition);
		this.append(') \{\n');
		if (object.then) {
			this.identionLevel++;
			this.compile(object.then);

			if (object.else) {
				this.identionLevel--;
				this.append('} else {\n');
				this.identionLevel++;
				this.compile(object.else);
			}
			this.identionLevel--;
		}

		this.append('}');
	}

	compilePrint(object) {
		this.append('console.log(');

		if (object.values) {
			for (let value of object.values) {
				if (object.values.indexOf(value) > 0) {
					this.append(', ');
				}
				this.compile(value);
			}
		}

		this.append(')');
	}
}

export default Compiler;
