import fs from 'fs';
import Lexer from './transpiler/lexer';
import Parser from './transpiler/parser';
import Compiler from './transpiler/compiler';

// let fileContent = fs.readFileSync('Example.dilmalang');
let fileContent = fs.readFileSync('Example - Loop.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

const lexer = new Lexer(fileContent);
lexer.print();

const parser = new Parser(lexer);
parser.parse();
parser.print();

const compiler = new Compiler(parser.program);
