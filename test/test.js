/* globals describe, it */
import Parser from '../src/transpiler/parser';
import assert from 'assert';


describe('Parser', function() {
	it('should parse a empty program', function() {
		const parser = new Parser('');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: []
		});
	});

	it.skip('should parse a declaration without value', function() {
		const parser = new Parser('politico salario.,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'declaration',
				name: 'salario'
			}]
		});
	});

	it('should parse a declaration with int value', function() {
		const parser = new Parser('politico salario = 100000.,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'declaration',
				name: 'salario',
				value: {
					type: 'number',
					value: 100000
				}
			}]
		});
	});

	it('should parse a declaration with string value', function() {
		const parser = new Parser('politico salario = "salario".,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'declaration',
				name: 'salario',
				value: {
					type: 'string',
					value: 'salario'
				}
			}]
		});
	});

	it('should parse a declaration with boolean value', function() {
		let parser = new Parser('politico salario = true.,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'declaration',
				name: 'salario',
				value: {
					type: 'boolean',
					value: true
				}
			}]
		});

		parser = new Parser('politico salario = false.,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'declaration',
				name: 'salario',
				value: {
					type: 'boolean',
					value: false
				}
			}]
		});
	});
});


// politico salario = 100000.,

// euViVoceVeja (i = 0., i < 10000., i++) {
// 	// Outro comentário
// 	porque (salario < 100000) {
// 		midiaGolpista("Número abaixo de 100.000: " + valor).,

// 		porque (salario > 10000000) {
// 			midiaGolpista("Número chegou no máximo de 10.000.000: " + valor).,
// 			pareiDeVer.,
// 		}
// 	} casoContrario {
// 		midiaGolpista("Número maior do que 100.000: " + valor).,
// 		euJaVi.,
// 	}
// }
