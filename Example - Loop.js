var salario = 100000;
for (var i = 0; i < 10000; i++) {
	salario = salario + i;
	if (salario < 100000) {
		console.log('Número abaixo de 100.000: ' + salario);
		if (salario > 10000000) {
			console.log('Número chegou no máximo de 10.000.000: ' + salario);
			break;
		}
	} else {
		console.log('Número maior do que 100.000: ' + salario);
		continue;
	}
}
