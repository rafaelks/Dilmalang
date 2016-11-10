/* globals describe, it */
import Compiler from '../src/transpiler/compiler';
import assert from 'assert';

function compare(source, target) {
	const compiler = new Compiler(source);
	compiler.compiled = compiler.compiled.replace(/\n$/, '');
	assert.equal(target, compiler.compiled);
}

describe('Transpiler', function() {
	it('should transpile a empty program', function() {
		compare('', '');
	});

	it('should transpile a declaration with no value', function() {
		compare('politico salario.,', 'var salario;');
	});

	it('should transpile a declaration with int value', function() {
		compare('politico salario = 100000.,', 'var salario = 100000;');
	});

	it('should transpile a declaration with string value', function() {
		compare('politico salario = "salario".,', 'var salario = "salario";');
	});

	it('should transpile a declaration with boolean value', function() {
		compare('politico salario = true.,', 'var salario = true;');

		compare('politico salario = false.,', 'var salario = false;');
	});

	it('should transpile a attribution of an expression', function() {
		compare('salario = salario + i.,', 'salario = salario + i;');
	});

	it('should transpile a print with no value', function() {
		compare('midiaGolpista().,', 'console.log();');
	});

	it('should transpile a print with string', function() {
		compare('midiaGolpista("Número abaixo de 100.000: ").,', 'console.log("Número abaixo de 100.000: ");');
	});

	it('should transpile a print with expression', function() {
		compare('midiaGolpista("Número abaixo de 100.000: " + 1000).,', 'console.log("Número abaixo de 100.000: " + 1000);');
	});

	it('should transpile a print with multiple values', function() {
		compare('midiaGolpista("Número abaixo de 100.000: ", 1000).,', 'console.log("Número abaixo de 100.000: ", 1000);');
	});

	it('should transpile a empty loop', function() {
		compare('euViVoceVeja (i = 0., i < 10000., i++) {}', 'for (i = 0; i < 10000; i++) {\n}');
	});

	it('should transpile a empty if', function() {
		compare('porque (salario < 100000) {}', 'if (salario < 100000) {\n}');
	});

	it('should transpile a empty if with empty else', function() {
		compare('porque (salario < 100000) {} casoContrario {}', 'if (salario < 100000) {\n}');
	});

	it('should transpile expression `1 + 1`', function() {
		compare('1 + 1', '1 + 1;');
	});

	it('should transpile expression `1 + 4 / 2`', function() {
		compare('1 + 4 / 2', '1 + 4 / 2;');
	});

	it('should transpile expression `4 / 2 + 1`', function() {
		compare('4 / 2 + 1', '4 / 2 + 1;');
	});

	it('should transpile expression `4 / 2 + 1 * 3 - 2`', function() {
		compare('4 / 2 + 1 * 3 - 2', '4 / 2 + 1 * 3 - 2;');
	});

	it('should transpile example 1', function() {
		const source = `politico salario = 100000.,

euViVoceVeja (i = 0., i < 10000., i++) {
	salario = salario + i.,

	// Outro comentário
	porque (salario < 100000) {
		midiaGolpista("Número abaixo de 100.000: " + salario).,

		porque (salario > 10000000) {
			midiaGolpista("Número chegou no máximo de 10.000.000: " + salario).,
			pareiDeVer.,
		}
	} casoContrario {
		midiaGolpista("Número maior do que 100.000: " + salario).,
		euJaVi.,
	}
}`;

		const target = `var salario = 100000;
for (i = 0; i < 10000; i++) {
    salario = salario + i;
    if (salario < 100000) {
        console.log("Número abaixo de 100.000: " + salario);
        if (salario > 10000000) {
            console.log("Número chegou no máximo de 10.000.000: " + salario);
            break;
        }
    } else {
        console.log("Número maior do que 100.000: " + salario);
        continue;
    }
}`;
		compare(source, target);
	});


});
