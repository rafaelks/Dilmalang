class Compiler {
	constructor(parsed) {
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

		}

		this.print();
	}


	// Sub Compilers

	compileDeclaration(object) {
		let name = object.name;
		let value = object.value.value;

		this.append("var " + name + " = " + value + ";\n");
	}

// "initialization": {
//         "type": "operation",
//         "operation": "=",
//         "left": {
//           "type": "var",
//           "name": "i"
//         },
//         "right": {
//           "type": "number",
//           "value": 0
//         }
//       },

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
}

export default Compiler;