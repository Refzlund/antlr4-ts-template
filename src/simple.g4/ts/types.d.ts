
import antlr4ts, { CommonToken } from 'antlr4ts'
import type SimpleParser from '../antlr/SimpleParser.js'


type Context<T extends string | number | symbol> = T extends `${string}Context` ? T : never
type Contexts<T extends keyof typeof SimpleParser> = {
	[Prop in T as Context<Prop> extends never ? never : Prop]: typeof SimpleParser[Prop]
}
type GetContexts = Contexts<keyof typeof SimpleParser>

interface MissingCTX {
	children?
}

export type CTX<T extends keyof GetContexts> = GetContexts[T]['prototype'] & MissingCTX

interface MissingToken<T extends CTX<any>> {
	getText(): string
	getChildCount(): number
	
	getChild(i: number): unknown
	getParent(): T
	
	toString(): string

	symbol: CommonToken
}

type InvalidToken = 'text' | 'type'

export type Token<T extends CTX<any>> = Omit<antlr4ts.Token, InvalidToken> & MissingToken<T>