/* eslint-disable */

import Parser from './parser';

class Compiler {
	constructor(parsed) {
		if (typeof parsed === 'string') {
			parsed = new Parser(parsed).parse();
		}

		this.parsed = parsed;
		this.compiled = "";
		this.compile(this.parsed);
	}

	append(string) {
		this.compiled += string;
	}

	print() {
		console.log("Compiled")
		console.log(this.compiled);
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

		this.print();

		return this.compiled;
	}


	// Sub Compilers

	compileDeclaration(object) {
		let name = object.name;
		let value = object.value.value;

		this.append("var " + name + " = " + value + ";\n");
	}

	compileLoop(object) {
		let initialization = object.initialization;
		let condition = object.condition;
		let finalExpression = object.finalExpression;
		let statement = object.statement;

		this.append("for (");

		this.compile(initialization);
		this.compile(condition);
		this.compile(finalExpression);

		this.append(") {\n");

		console.log(statement)
		this.compile(statement);
	}

	compileBreak(object) {
		this.append("break;\n");
	}

	compileContinue(object) {
		this.append("continue;\n");
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

			this.append([leftName, leftValue, operation, rightValue, rightName].join(" ") + ";")
		} else {
			this.append([leftName, leftValue, operation].join("") + ";")
		}
	}

	compileCondition(object) {
		let condition = object.condition;
		let conditionThen = object.then;
		let conditionElse = object.else;

		this.append("if (");
		this.compile(condition);
		this.append(") {\n");
		this.compile(conditionThen);

		if (object.else) {
			this.append("} else {\n");
			this.compile(conditionElse);
		}

		this.append("}\n");
	}

	compilePrint(object) {
		let values = object.values;
		let valuesCompiled = [];

		this.append("console.log(");

		for (let value of values) {
			this.compile(value);
		}

		this.append(");\n");
	}
}

export default Compiler;
