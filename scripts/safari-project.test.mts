import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { configureProject, validateDescription } from './safari-project.mts'
import type { SafariPackage, XcodeProject, ProjectObject } from './safari-project.mts'

const pkg: SafariPackage = JSON.parse(
	readFileSync(new URL('../package.json', import.meta.url), 'utf8')
) as SafariPackage
const names: string[] = [
	'Urlala (iOS)',
	'Urlala (macOS)',
	'Urlala Extension (iOS)',
	'Urlala Extension (macOS)'
]

function createProject(): XcodeProject {
	return {
		objects: Object.fromEntries(
			names.flatMap((name: string): [string, ProjectObject][] => [
				[name, { isa: 'PBXNativeTarget', name, buildConfigurationList: `${name} configs` }],
				[
					`${name} configs`,
					{ isa: 'XCConfigurationList', buildConfigurations: [`${name} Debug`, `${name} Release`] }
				],
				...['Debug', 'Release'].map((mode: string): [string, ProjectObject] => [
					`${name} ${mode}`,
					{ isa: 'XCBuildConfiguration', buildSettings: { SWIFT_VERSION: '5.0' } }
				])
			])
		)
	}
}

test('configures every target and configuration without mutations; repeatable', (): void => {
	const project: XcodeProject = createProject()
	const original: XcodeProject = structuredClone(project)
	const result: XcodeProject = configureProject(project, pkg)
	assert.deepEqual(project, original)
	assert.deepEqual(configureProject(result, pkg), result)
	for (const name of names) {
		for (const mode of ['Debug', 'Release']) {
			const settings: Record<string, string | string[]> | undefined =
				result.objects[`${name} ${mode}`]?.buildSettings
			assert.ok(settings)
			assert.equal(settings.SWIFT_VERSION, '5.0')
			assert.equal(settings.MARKETING_VERSION, pkg.version)
			assert.equal(settings.CURRENT_PROJECT_VERSION, pkg.safari.buildNumber)
			assert.equal(settings.DEVELOPMENT_TEAM, pkg.safari.team)
			assert.equal(settings.CODE_SIGN_STYLE, 'Automatic')
			assert.equal(
				settings.PRODUCT_BUNDLE_IDENTIFIER,
				pkg.safari.bundleIdentifier + (name.includes('Extension') ? '.Extension' : '')
			)
			if (name.includes('macOS')) {
				assert.equal(settings.ENABLE_APP_SANDBOX, 'YES')
				assert.equal(settings.ENABLE_OUTGOING_NETWORK_CONNECTIONS, 'YES')
			}
		}
	}
	assert.equal(
		result.objects['Urlala (macOS) Release']?.buildSettings
			?.INFOPLIST_KEY_LSApplicationCategoryType,
		pkg.safari.category
	)
})

test('missing targets and configuration lists fail explicitly', (): void => {
	assert.throws(
		(): XcodeProject => configureProject({ objects: {} }, pkg),
		/Expected one generated target/
	)
	const project: XcodeProject = createProject()
	assert.throws(
		(): XcodeProject =>
			configureProject(
				{
					...project,
					objects: {
						...project.objects,
						'Urlala (iOS) configs': { isa: 'XCConfigurationList', buildConfigurations: [] }
					}
				},
				pkg
			),
		/No build configurations/
	)
})

test('validates localized description boundaries', (): void => {
	validateDescription('a'.repeat(112), 'en')
	validateDescription('북마크 저장', 'ko')
	for (const message of [undefined, null, 12, '', 'a'.repeat(113)]) {
		assert.throws((): void => validateDescription(message, 'en'), /locale=en/)
	}
})
