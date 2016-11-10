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

		} else if (type == "condition") {
			this.compileCondition(object);

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

	compileOperation(object) {
		let operation = object.operation;
		let leftType = object.left.type;
		let leftName = object.left.name;

		if (object.right) {
			let rightValue = object.right.value;
			this.append([leftName, operation, rightValue].join(" ") + ";")
		} else {
			this.append([leftName, operation].join("") + ";")
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
		this.compile(conditionElse);
		this.append("}\n");
		// "type": "condition",
  //           "condition": {
  //             "type": "operation",
  //             "operation": "<",
  //             "left": {
  //               "type": "var",
  //               "name": "salario"
  //             },
  //             "right": {
  //               "type": "number",
  //               "value": 100000
  //             }
  //           },
	}
}

export default Compiler;
