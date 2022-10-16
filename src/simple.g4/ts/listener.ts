import type { ElementContext, ProgramContext} from '../antlr/SimpleParser.js'
import { SimpleListener } from '../antlr/SimpleListener.js'

export default class Listener implements SimpleListener {

	enterProgram(ctx: ProgramContext) {
		
	}

	enterElement(context: ElementContext) {
		console.log(`Element start line number ${context._start.line}`)
		// ...
	}
	
}