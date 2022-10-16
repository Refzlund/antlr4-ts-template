import SimpleVisitor from '../antlr/SimpleVisitor.js'
import type { CTX, Token } from './types.js'

export default class Visitor extends SimpleVisitor {
	visit(tree) {
		return this.visitChildren(tree)
	}
	
	visitChildren(ctx) {
		// console.log(Object.keys(ctx))
		if (!ctx) {
			return
		}

		if (ctx.children) {
			return ctx.children.map(child => {
				if (child.children && child.children.length != 0) {
					return child.accept(this)
				} else {
					// console.log(child.getText())
					return child.getText()
				}
			})
		}
	}

	visitFixedArray(ctx: CTX<'FixedArrayContext'>) {
		let i = 0
		let int = ctx.INTEGER(i) as Token<typeof ctx>
		while (int = ctx.INTEGER(i)) {
			console.log(int.toString());
			i++
		}
		console.log(`FixedArray '${ctx.ID()}' has a depth of ${i}`)
	}

	visitDeclaration(ctx: CTX<'DeclarationContext'>) {
		
	}
}