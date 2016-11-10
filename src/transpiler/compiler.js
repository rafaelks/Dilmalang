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
		console.log(this.identionLevel);

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
		}

		return this.compiled;
	}


	// Sub Compilers

	compileDeclaration(object) {
		let name = object.name;
		this.append('var ' + name);

		if (object.value) {
			if (object.value.type === 'string') {
				this.append(' = "' + object.value.value + '"');
			} else {
				this.append(' = ' + object.value.value);
			}
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
		this.identionLevel--;

		if (statement) {
			this.compile(statement);
		}
	}

	compileBreak(object) {
		this.append("break;\n");
		this.identionLevel--;
	}

	compileContinue(object) {
		this.append("continue;\n");
		this.identionLevel--;
	}

	compileOperation(object) {
		let operation = object.operation;
		let leftType = object.left.type;
		let leftName = object.left.name;
		var leftValue = object.left.value;

		if (leftType === "string") {
			leftValue = "\"" + leftValue + "\""
		}

		if (object.right) {
			let rightType = object.right.type;
			let rightName = object.right.name;
			var rightValue = object.right.value;

			if (rightType === "string") {
				rightValue = "\"" + rightValue + "\""
			}

			this.append([leftName, leftValue, operation, rightValue, rightName].join(" "))
		} else {
			this.append([leftName, leftValue, operation].join(""))
		}
	}

	compileCondition(object) {
		let condition = object.condition;
		let conditionThen = object.then;
		let conditionElse = object.else;

		this.append("if (");
		this.identionLevel++;
		this.compile(condition);
		this.identionLevel++;
		this.append(") {\n");
		if (conditionThen) {
			this.compile(conditionThen);

			if (object.else) {
				this.append("} else {\n");
				this.compile(conditionElse);
				this.identionLevel--;
			}
		}

		this.append("}\n");
		this.identionLevel--;
	}

	compilePrint(object) {
		let values = object.values;
		let valuesCompiled = [];

		this.append("console.log(");

		if (values) {
			for (let value of values) {
				this.compile(value);
			}
		}

		this.append(");\n");
	}
}

export default Compiler;
