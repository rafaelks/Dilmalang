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

	it('should parse a declaration with no value', function() {
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

	it('should parse a print with no value', function() {
		const parser = new Parser('midiaGolpista().,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'print'
			}]
		});
	});

	it('should parse a print with string', function() {
		const parser = new Parser('midiaGolpista("Número abaixo de 100.000: ").,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'print',
				values: [{
					type: 'string',
					value: 'Número abaixo de 100.000: '
				}]
			}]
		});
	});

	it('should parse a print with expression', function() {
		const parser = new Parser('midiaGolpista("Número abaixo de 100.000: " + 1000).,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'print',
				values: [{
					type: 'operation',
					operation: '+',
					left: {
						type: 'string',
						value: 'Número abaixo de 100.000: '
					},
					right: {
						type: 'number',
						value: 1000
					}
				}]
			}]
		});
	});

	it('should parse a print with multiple values', function() {
		const parser = new Parser('midiaGolpista("Número abaixo de 100.000: ", 1000).,');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'print',
				values: [{
					type: 'string',
					value: 'Número abaixo de 100.000: '
				}, {
					type: 'number',
					value: 1000
				}]
			}]
		});
	});

	it('should parse a empty loop', function() {
		const parser = new Parser('euViVoceVeja (i = 0., i < 10000., i++) {}');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'loop',
				initialization: {
					type: 'operation',
					operation: '=',
					left: {
						type: 'var',
						name: 'i'
					},
					right: {
						type: 'number',
						value: 0
					}
				},
				condition: {
					type: 'operation',
					operation: '<',
					left: {
						type: 'var',
						name: 'i'
					},
					right: {
						type: 'number',
						value: 10000
					}
				},
				finalExpression: {
					type: 'operation',
					operation: '++',
					left: {
						type: 'var',
						name: 'i'
					}
				}
			}]
		});
	});

	it('should parse a empty loop with declaration', function() {
		const parser = new Parser('euViVoceVeja (politico i = 0., i < 10000., i++) {}');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'loop',
				initialization: {
					type: 'declaration',
					name: 'i',
					value: {
						type: 'number',
						value: 0
					}
				},
				condition: {
					type: 'operation',
					operation: '<',
					left: {
						type: 'var',
						name: 'i'
					},
					right: {
						type: 'number',
						value: 10000
					}
				},
				finalExpression: {
					type: 'operation',
					operation: '++',
					left: {
						type: 'var',
						name: 'i'
					}
				}
			}]
		});
	});

	it('should parse a empty if', function() {
		const parser = new Parser('porque (salario < 100000) {}');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'condition',
				condition: {
					type: 'operation',
					operation: '<',
					left: {
						type: 'var',
						name: 'salario'
					},
					right: {
						type: 'number',
						value: 100000
					}
				}
			}]
		});
	});

	it('should parse a empty if with empty else', function() {
		const parser = new Parser('porque (salario < 100000) {} casoContrario {}');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'condition',
				condition: {
					type: 'operation',
					operation: '<',
					left: {
						type: 'var',
						name: 'salario'
					},
					right: {
						type: 'number',
						value: 100000
					}
				}
			}]
		});
	});

	it('should parse expression `1 + 1`', function() {
		const parser = new Parser('1 + 1');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'operation',
				operation: '+',
				left: {
					type: 'number',
					value: 1
				},
				right: {
					type: 'number',
					value: 1
				}
			}]
		});
	});

	it('should parse expression `1 + 4 / 2`', function() {
		const parser = new Parser('1 + 4 / 2');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'operation',
				operation: '+',
				left: {
					type: 'number',
					value: 1
				},
				right: {
					type: 'operation',
					operation: '/',
					left: {
						type: 'number',
						value: 4
					},
					right: {
						type: 'number',
						value: 2
					}
				}
			}]
		});
	});

	it('should parse expression `4 / 2 + 1`', function() {
		const parser = new Parser('4 / 2 + 1');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'operation',
				operation: '+',
				left: {
					type: 'operation',
					operation: '/',
					left: {
						type: 'number',
						value: 4
					},
					right: {
						type: 'number',
						value: 2
					}
				},
				right: {
					type: 'number',
					value: 1
				}
			}]
		});
	});

	it('should parse expression `4 / 2 + 1 * 3 - 2`', function() {
		const parser = new Parser('4 / 2 + 1 * 3 - 2');
		assert.deepEqual(parser.parse(), {
			type: 'prog',
			prog: [{
				type: 'operation',
				operation: '+',
				left: {
					type: 'operation',
					operation: '/',
					left: {
						type: 'number',
						value: 4
					},
					right: {
						type: 'number',
						value: 2
					}
				},
				right: {
					type: 'operation',
					operation: '-',
					left: {
						type: 'operation',
						operation: '*',
						left: {
							type: 'number',
							value: 1
						},
						right: {
							type: 'number',
							value: 3
						}
					},
					right: {
						type: 'number',
						value: 2
					}
				}
			}]
		});
	});
});
