/* eslint-disable */

import Parser from './parser';

class Compiler {
	constructor(parsed) {
		if (typeof parsed === 'string') {
			parsed = new Parser(parsed).parse();
		}

		this.identionLevel = 0;
		this.parsed = parsed;
		this.compiled = "";
		this.compile(this.parsed);
	}

	appendSpaces() {
		// console.log(this.identionLevel);

		for (var i = 0; i < this.identionLevel * 4; i++) {
			this.compiled += " ";
		}
	}

	append(string) {
		this.compiled += string;

		if (string.indexOf("\n") != -1) {
			this.appendSpaces();
		}
	}

	print() {
		console.log("+--- Result in JavaScript ---+");
		console.log(this.compiled);
		console.log("+-----------  End -----------+");
	}


	// Compile all the code

	compile(object) {
		let type = object.type;

		if (type === "prog") {
			let program = object.prog;

			for (let smallProgram of program) {
				this.compile(smallProgram)
			}

		} else if (type === "declaration") {
			this.compileDeclaration(object)

		} else if (type === "loop") {
			this.compileLoop(object)

		} else if (type === "operation") {
			this.compileOperation(object);

		} else if (type === "condition") {
			this.compileCondition(object);

		} else if (type === "break") {
			this.compileBreak(object);

		} else if (type === "continue") {
			this.compileContinue(object);

		} else if (type === "print") {
			this.compilePrint(object);

		} else if (type === "string") {
			this.append('"' + object.value + '"');

		} else if (type === "number") {
			this.append(String(object.value));

		} else if (type === "boolean") {
			this.append(object.value ? 'true' : 'false');
		}

		return this.compiled;
	}


	// Sub Compilers

	compileDeclaration(object) {
		let name = object.name;
		this.append('var ' + name);

		if (object.value) {
			this.append(' = ');

			this.compile(object.value);
		}

		this.append(';\n');
	}

	compileLoop(object) {
		let initialization = object.initialization;
		let condition = object.condition;
		let finalExpression = object.finalExpression;
		let statement = object.statement;

		this.append("for (");
		this.identionLevel++;

		this.compile(initialization);
		this.compile(condition);
		this.append(";");
		this.compile(finalExpression);

		this.append(") {\n");

		if (statement) {
			this.compile(statement);
		}

		this.append("}\n")
	}

	compileBreak(object) {
		this.identionLevel--;
		this.append("break;\n");
	}

	compileContinue(object) {
		this.identionLevel--;
		this.append("continue;\n");
	}

	compileOperation(object) {
		let operation = object.operation;
		let leftType = object.left.type;
		var leftValue = object.left.value;

		if (object.left.name) {
			this.append(object.left.name);
			this.append(' ');
		}

		this.compile(object.left);

		if (object.right) {
			this.append(' ');
			this.append(operation);
			this.append(' ');

			if (object.right.name) {
				this.append(object.right.name);
				this.append(' ');
			}

			this.compile(object.right);
		} else {
			this.append(operation);
		}
	}

	compileCondition(object) {
		let condition = object.condition;
		let conditionThen = object.then;
		let conditionElse = object.else;

		this.append("if (");
		this.compile(condition);
		this.identionLevel++;
		this.append(") {\n");
		if (conditionThen) {
			this.compile(conditionThen);

			if (object.else) {
				this.identionLevel++;
				this.append("} else {\n");
				this.compile(conditionElse);
			}
		}

		this.identionLevel--;
		this.append("}\n");
	}

	compilePrint(object) {
		let valuesCompiled = [];

		this.append("console.log(");

		if (object.values) {
			for (let value of object.values) {
				if (object.values.indexOf(value) > 0) {
					this.append(', ');
				}
				this.compile(value);
			}
		}

		this.append(");\n");
	}
}

export default Compiler;
