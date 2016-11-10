/* globals describe, it */
import Compiler from '../src/transpiler/compiler';
import assert from 'assert';

function compare(source, target) {
	const compiler = new Compiler(source);
	assert.equal(compiler.compile(), target);
}

describe('Transpiler', function() {
	// it('should transpile a empty program', function() {
	// 	const compiler = new Compiler('');
	// 	assert.equal(compiler.compile(), '');
	// });

	it('should transpile a declaration with no value', function() {
		compare('politico salario.,', 'var salario;');
	});

	it('should transpile a declaration with int value', function() {
		const compiler = new Compiler('politico salario = 100000.,');
		assert.equal(compiler.compile(), 'var salario = 100000;');
	});

	it('should transpile a declaration with string value', function() {
		const compiler = new Compiler('politico salario = "salario".,');
		assert.equal(compiler.compile(), 'var salario = "salario";');
	});

	// it('should transpile a declaration with boolean value', function() {
	// 	let parser = new Parser('politico salario = true.,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'declaration',
	// 			name: 'salario',
	// 			value: {
	// 				type: 'boolean',
	// 				value: true
	// 			}
	// 		}]
	// 	});

	// 	parser = new Parser('politico salario = false.,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'declaration',
	// 			name: 'salario',
	// 			value: {
	// 				type: 'boolean',
	// 				value: false
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile a print with no value', function() {
	// 	const compiler = new Compiler('midiaGolpista().,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'print'
	// 		}]
	// 	});
	// });

	// it('should transpile a print with string', function() {
	// 	const compiler = new Compiler('midiaGolpista("Número abaixo de 100.000: ").,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'print',
	// 			values: [{
	// 				type: 'string',
	// 				value: 'Número abaixo de 100.000: '
	// 			}]
	// 		}]
	// 	});
	// });

	// it('should transpile a print with expression', function() {
	// 	const compiler = new Compiler('midiaGolpista("Número abaixo de 100.000: " + 1000).,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'print',
	// 			values: [{
	// 				type: 'operation',
	// 				operation: '+',
	// 				left: {
	// 					type: 'string',
	// 					value: 'Número abaixo de 100.000: '
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 1000
	// 				}
	// 			}]
	// 		}]
	// 	});
	// });

	// it('should transpile a print with multiple values', function() {
	// 	const compiler = new Compiler('midiaGolpista("Número abaixo de 100.000: ", 1000).,');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'print',
	// 			values: [{
	// 				type: 'string',
	// 				value: 'Número abaixo de 100.000: '
	// 			}, {
	// 				type: 'number',
	// 				value: 1000
	// 			}]
	// 		}]
	// 	});
	// });

	// it('should transpile a empty loop', function() {
	// 	const compiler = new Compiler('euViVoceVeja (i = 0., i < 10000., i++) {}');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'loop',
	// 			initialization: {
	// 				type: 'operation',
	// 				operation: '=',
	// 				left: {
	// 					type: 'var',
	// 					name: 'i'
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 0
	// 				}
	// 			},
	// 			condition: {
	// 				type: 'operation',
	// 				operation: '<',
	// 				left: {
	// 					type: 'var',
	// 					name: 'i'
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 10000
	// 				}
	// 			},
	// 			finalExpression: {
	// 				type: 'operation',
	// 				operation: '++',
	// 				left: {
	// 					type: 'var',
	// 					name: 'i'
	// 				}
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile a empty if', function() {
	// 	const compiler = new Compiler('porque (salario < 100000) {}');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'condition',
	// 			condition: {
	// 				type: 'operation',
	// 				operation: '<',
	// 				left: {
	// 					type: 'var',
	// 					name: 'salario'
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 100000
	// 				}
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile a empty if with empty else', function() {
	// 	const compiler = new Compiler('porque (salario < 100000) {} casoContrario {}');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'condition',
	// 			condition: {
	// 				type: 'operation',
	// 				operation: '<',
	// 				left: {
	// 					type: 'var',
	// 					name: 'salario'
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 100000
	// 				}
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile expression `1 + 1`', function() {
	// 	const compiler = new Compiler('1 + 1');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'operation',
	// 			operation: '+',
	// 			left: {
	// 				type: 'number',
	// 				value: 1
	// 			},
	// 			right: {
	// 				type: 'number',
	// 				value: 1
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile expression `1 + 4 / 2`', function() {
	// 	const compiler = new Compiler('1 + 4 / 2');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'operation',
	// 			operation: '+',
	// 			left: {
	// 				type: 'number',
	// 				value: 1
	// 			},
	// 			right: {
	// 				type: 'operation',
	// 				operation: '/',
	// 				left: {
	// 					type: 'number',
	// 					value: 4
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 2
	// 				}
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile expression `4 / 2 + 1`', function() {
	// 	const compiler = new Compiler('4 / 2 + 1');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'operation',
	// 			operation: '+',
	// 			left: {
	// 				type: 'operation',
	// 				operation: '/',
	// 				left: {
	// 					type: 'number',
	// 					value: 4
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 2
	// 				}
	// 			},
	// 			right: {
	// 				type: 'number',
	// 				value: 1
	// 			}
	// 		}]
	// 	});
	// });

	// it('should transpile expression `4 / 2 + 1 * 3 - 2`', function() {
	// 	const compiler = new Compiler('4 / 2 + 1 * 3 - 2');
	// 	assert.equal(compiler.compile(), {
	// 		type: 'prog',
	// 		prog: [{
	// 			type: 'operation',
	// 			operation: '+',
	// 			left: {
	// 				type: 'operation',
	// 				operation: '/',
	// 				left: {
	// 					type: 'number',
	// 					value: 4
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 2
	// 				}
	// 			},
	// 			right: {
	// 				type: 'operation',
	// 				operation: '-',
	// 				left: {
	// 					type: 'operation',
	// 					operation: '*',
	// 					left: {
	// 						type: 'number',
	// 						value: 1
	// 					},
	// 					right: {
	// 						type: 'number',
	// 						value: 3
	// 					}
	// 				},
	// 				right: {
	// 					type: 'number',
	// 					value: 2
	// 				}
	// 			}
	// 		}]
	// 	});
	// });
});
