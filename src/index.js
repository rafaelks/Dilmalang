import fs from 'fs';
import Lexer from './transpiler/lexer';
import Parser from './transpiler/parser';

// let fileContent = fs.readFileSync('Example.dilmalang');
let fileContent = fs.readFileSync('Example - Loop.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

const lexer = new Lexer(fileContent);
lexer.printTokens();

new Parser(lexer);
