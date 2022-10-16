import fs from 'fs'

import { resolve } from 'path'
import chokidar, { FSWatcher } from 'chokidar'
import { execSync } from 'child_process'

import c from './c.js'

const cwd = process.cwd()
const srcFolder = resolve(cwd, './src')

const watchers: FSWatcher[] = []
process.on('exit', () => {
	for (let watcher of watchers)
		watcher.close()
})

const gen = process.argv.includes('-g')

async function init() {
	for (let g4Folder of fs.readdirSync(srcFolder)) {
		if (!g4Folder.endsWith('.g4'))
			continue
		g4Folder = resolve(srcFolder, g4Folder)
		if (fs.statSync(g4Folder).isDirectory()) {
			const g4FolderFiles = fs.readdirSync(g4Folder)
			
			let g4 = g4FolderFiles.find(v => v.endsWith('.g4'))
			if (!g4)
				continue
			g4 = resolve(g4Folder, g4)
			
			const testInputs = g4FolderFiles.filter(v => v.endsWith('.test')).map(v => ({
				name: v,
				resolved: resolve(g4Folder, v)
			}))
			if (testInputs.length == 0)
				continue
			
			const generatedOutput = resolve(g4Folder, 'antlr')

			const generate = () => {
				!gen && console.clear()
				console.log('... Generating')
				const command = `pnpm antlr4 -Dlanguage=JavaScript -visitor ${g4} -o ${generatedOutput}`
				try {
					execSync(command)
				} catch (error) {}
			}
			
			if (gen) {
				generate()
				return
			}

			// * ts-folder

			let tsFolder = g4FolderFiles.find(v => v == 'ts')
			if (!tsFolder)
				continue
			tsFolder = resolve(g4Folder, tsFolder)

			if (!fs.statSync(tsFolder).isDirectory())
				continue

			let tsIndexFile = fs.readdirSync(tsFolder).find(v => v == 'index.ts')
			if (!tsIndexFile)
				continue

			tsIndexFile = resolve(tsFolder, tsIndexFile).replace(srcFolder, '.').replaceAll(/\\/g, '/')

			const tsIndexFunction = (await import(tsIndexFile)).default
			g4 = resolve(g4Folder, g4)
			

			function read(filePath) {
				try {
					fs.accessSync(filePath, fs.constants.R_OK)
					return fs.readFileSync(filePath, 'utf-8')
				} catch (error) {
					return false
				}
			}

			const analyze = async () => {
				console.clear()
				
				let alternate = 34
				const alt = () => {
					alternate = alternate == 32 ? 34 : 32
					return alternate
				}

				for (let testInput of testInputs) {
					console.log('')
					c.log(alt())('———')(0)
					console.log()
					let data
					while (!(data = read(testInput.resolved))) {
						await new Promise(r => setTimeout(r, 50))
					}
					let time = testInputs.length == 1 ? 'Took' : `'${testInput.name}' took`
					time = c(alternate)(time)(0)
					
					console.time(time)
					tsIndexFunction(data)
					console.log('')
					console.timeEnd(time)
				}
			}

			const watchTestInput = chokidar.watch(testInputs.map(v => v.resolved), {})
			watchTestInput.on('change', analyze)
			watchers.push(watchTestInput)

			const watchG4 = chokidar.watch(g4, {})
			watchG4.on('change', generate)
			watchers.push(watchG4)

			analyze()
		}
	}
}

init()