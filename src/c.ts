/** 
 * Apply [color codes](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors) to a string, 
 * for better console clarity. 
 * 
 * `C(32, 44)('Some green message with a blue background')(0)`
*/
const C = (...a) => (msg) => (...c) => a.map(m => `\x1b[${m}m`).join('') + msg + (c.length > 0 && c || [0]).map(m => `\x1b[${m}m`).join('')

/** 
 * Apply [color codes](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors) for a console.log, 
 * for better console clarity. 
 * 
 * `C.log(32, 44)('Some green message with a blue background')(0)`
*/
C.log = (...a) => (msg) => (...c) => console.log(C(...a)(msg)(...c))
/** 
 * Apply [color codes](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors) for a console.error, 
 * for better console clarity. 
 * 
 * `C.error(32, 44)('Some green message with a blue background')(0)`
*/
C.error = (...a) => (msg) => (...c) => console.error(C(...a)(msg)(...c))
/** 
 * Apply [color codes](https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors) for a console.warn, 
 * for better console clarity. 
 * 
 * `C.warn(32, 44)('Some green message with a blue background')(0)`
*/
C.warn = (...a) => (msg) => (...c) => console.warn(C(...a)(msg)(...c))
export default C