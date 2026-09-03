import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { configureProject, validateDescription } from './safari-project.mts'
import type { SafariPackage, XcodeProject } from './safari-project.mts'

/** Regenerate the wrapper and apply release settings persisted in package.json. */
function main(): void {
	const root: string = fileURLToPath(new URL('../', import.meta.url))
	const pkg: SafariPackage = JSON.parse(
		readFileSync(join(root, 'package.json'), 'utf8')
	) as SafariPackage
	const extensionDir: string = join(root, '.output/safari-mv2')
	const manifest: { version: string } = JSON.parse(
		readFileSync(join(extensionDir, 'manifest.json'), 'utf8')
	) as { version: string }
	if (manifest.version !== pkg.version) {
		throw new Error('Safari manifest version must match package.json version; check wxt.config.ts')
	}
	const locales: string[] = readdirSync(join(extensionDir, '_locales'))
	if (locales.length === 0) throw new Error(`No locale files in ${extensionDir}/_locales`)
	for (const locale of locales) {
		const messages: { extensionDescription?: { message?: unknown } } = JSON.parse(
			readFileSync(join(extensionDir, '_locales', locale, 'messages.json'), 'utf8')
		) as { extensionDescription?: { message?: unknown } }
		validateDescription(messages.extensionDescription?.message, locale)
	}
	execFileSync(
		'xcrun',
		[
			'safari-web-extension-converter',
			extensionDir,
			'--project-location',
			join(root, '.output'),
			'--app-name',
			pkg.name,
			'--bundle-identifier',
			pkg.safari.bundleIdentifier,
			'--swift',
			'--no-open',
			'--no-prompt',
			'--force'
		],
		{ stdio: 'inherit' }
	)
	const projectPath: string = join(
		root,
		'.output',
		pkg.name,
		`${pkg.name}.xcodeproj/project.pbxproj`
	)
	const project: XcodeProject = JSON.parse(
		execFileSync('plutil', ['-convert', 'json', '-o', '-', projectPath], { encoding: 'utf8' })
	) as XcodeProject
	const configuredXml: Buffer = execFileSync('plutil', ['-convert', 'xml1', '-o', '-', '-'], {
		input: JSON.stringify(configureProject(project, pkg))
	})
	writeFileSync(projectPath, configuredXml)
	execFileSync('plutil', ['-lint', projectPath], { stdio: 'inherit' })
}

main()
