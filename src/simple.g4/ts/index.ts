import { CharStreams, CommonTokenStream } from 'antlr4ts'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

import SimpleLexer from '../antlr/SimpleLexer.js'
import SimpleParser from '../antlr/SimpleParser.js'
import antlr4 from 'antlr4'

import Visitor from './visitor.js'
import Listener from './listener.js'
import SimpleListener from '../antlr/SimpleListener.js'


export default async function run(input: string) {
	try {
		const chars = new antlr4.InputStream(input) 
		const lexer = new SimpleLexer(chars)
		const tokens = new antlr4.CommonTokenStream(lexer)
		const parser = new SimpleParser(tokens)
		
		parser.buildParseTrees = true
		const tree = parser.program()
		
		// * Visitor approach
		const visitor = new Visitor()
		visitor.visit(tree)
		
		// * Listener approach
		// const listener: SimpleListener = new Listener()
		
		
	} catch (error) {
		console.error('Errored')
		console.error(error)
		return
	}
}

