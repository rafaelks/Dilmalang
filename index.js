const fs = require('fs');
const Lexer = require('./transpiler/lexer');

let fileContent = fs.readFileSync('Example.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

new Lexer(fileContent);
