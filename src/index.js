import fs from 'fs';
import Lexer from './transpiler/lexer';

let fileContent = fs.readFileSync('Example.dilmalang');

if (!fileContent) {
	console.error('File not found');
}

fileContent = fileContent.toString();

new Lexer(fileContent);
