class Compiler {
	constructor(parsed) {
		this.parsed = parsed;
		this.compiled = "";
		this.compile(this.parsed);
	}

	print() {
		console.log("Compiled")
		console.log(this.compiled);
	}

	compile(object) {
		let type = object["type"]

		if (type == "prog") {
			let program = object["prog"]

			for (smallProgram in program) {
				this.compile(smallProgram)
			}

		} else if (type == "declaration") {
			this.compileDeclaration(object)
		}

		this.print()
	}


	// Sub Compilers

	compileDeclaration(object) {
		let name = object["name"];
		let value = object["value"]["value"];

		this.compiled += "var " + name + " = " + value + ";\n";
	}

	compileLoop(object) {

	}
}

export default Compiler;