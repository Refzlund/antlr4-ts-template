grammar Simple;

/*
	* Parser rules
*/

program
	: '\n'* element* '\n'* EOF
	;

element
    : statement ';'
	| ifBlock
    ;

statement
	: declaration
	| functionCall
	;

declaration
	: TYPE ID ('=' expression)?					#notArray
	| TYPE '[]'* ID ('=' array)?				#dynamicArray
	| TYPE ID ('[' INTEGER ']')* ('=' array)? 	#fixedArray
	;

block
	: '{' element* '}'
	;

ifBlock
	: 'if' '(' expression ')' (block | '\n'? element) (elseIfBlock | elseBlock)?
	;

elseIfBlock
	: 'else' ifBlock
	;

elseBlock
	: 'else' block
	;

functionCall
	: ID '(' (expression (',' expression)*)? ')'
	;

constant
	: INTEGER
	| FLOAT
	| BOOLEAN
	| STRING
	| CHARACTER
	;

expression
	: constant											#constantExpression
	| ID												#identifierExpression
	| functionCall										#functionCallExpression
	| '(' expression ')'								#parenthesizedExpression
	| '!' expression									#notExpression
	| expression multiplicativeOperator expression		#multiplicativeExpression
	| expression additiveOperator expression			#additiveExpression
	| expression comparisonOperator expression			#comparisonExpression
	| expression booleanOperator expression				#booleanExpression
	;

array
	:	'{' arrayitem (',' arrayitem)* '}'
	;

arrayitem
	: constant 
	| array
	;

multiplicativeOperator
	: '*'
	| '/'
	| '%'
	;

additiveOperator
	: '+'
	| '-'
	;

comparisonOperator
	: '=='
	| '>='
	| '<='
	| '>'
	| '<'
	;

booleanOperator
	: '||'
	| '&&'
	;

/* 
	Tokens
*/

INTEGER
	: '-'?[1-9]?[0-9]+
	;

FLOAT
	: '-'?[1-9]?[0-9]+ '.' [0-9]+
	;

STRING
	: '"' (~[\r\n"])* '"'
	;

CHARACTER
	: '\'' ~['] '\''
	;

BOOLEAN
	: 'true'
	| 'false'
	;

NULL
	: 'null'
	;

TYPE
	: 'int'
	| 'char'
	| 'float'
	| 'bool'
	| 'Handle'
	;

ID
	: [A-Za-z_][A-Za-z0-9_]*
	;

NL
	: [\n]+
    ;

COMMENT
	: (('//' ~[\n\r]*) | ('/*' .*? '*/')) -> skip
	;

WS
	: [ \t\n\r]+ -> skip
	;