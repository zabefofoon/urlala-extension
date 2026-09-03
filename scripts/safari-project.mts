export interface SafariPackage {
	name: string
	version: string
	safari: {
		bundleIdentifier: string
		team: string
		category: string
		buildNumber: string
	}
}

export interface ProjectObject {
	isa: string
	name?: string
	buildConfigurationList?: string
	buildConfigurations?: string[]
	buildSettings?: Record<string, string | string[]>
}

export interface XcodeProject {
	objects: Record<string, ProjectObject>
}

/** Reject descriptions that would fail Apple's localized manifest validation. */
export function validateDescription(message: unknown, locale: string): void {
	if (typeof message !== 'string' || message.length === 0 || message.length > 112) {
		throw new TypeError(
			`Invalid Safari description: locale=${locale}, message=${JSON.stringify(message)}; ` +
				'extensionDescription.message must be a nonempty string of at most 112 characters.'
		)
	}
}

/** Configure generated targets without mutating the project or unrelated settings. */
export function configureProject(project: XcodeProject, pkg: SafariPackage): XcodeProject {
	const common: Record<string, string> = {
		CODE_SIGN_STYLE: 'Automatic',
		DEVELOPMENT_TEAM: pkg.safari.team,
		MARKETING_VERSION: pkg.version,
		CURRENT_PROJECT_VERSION: pkg.safari.buildNumber
	}
	const app: Record<string, string> = {
		...common,
		PRODUCT_BUNDLE_IDENTIFIER: pkg.safari.bundleIdentifier
	}
	const extension: Record<string, string> = {
		...common,
		PRODUCT_BUNDLE_IDENTIFIER: `${pkg.safari.bundleIdentifier}.Extension`
	}
	const sandbox: Record<string, string> = {
		ENABLE_APP_SANDBOX: 'YES',
		ENABLE_OUTGOING_NETWORK_CONNECTIONS: 'YES'
	}
	const targets: Record<string, Record<string, string>> = {
		[`${pkg.name} (iOS)`]: app,
		[`${pkg.name} Extension (iOS)`]: extension,
		[`${pkg.name} (macOS)`]: {
			...app,
			...sandbox,
			INFOPLIST_KEY_LSApplicationCategoryType: pkg.safari.category
		},
		[`${pkg.name} Extension (macOS)`]: { ...extension, ...sandbox }
	}
	const objects: Record<string, ProjectObject> = { ...project.objects }
	for (const [name, settings] of Object.entries(targets)) {
		const matches: ProjectObject[] = Object.values(objects).filter(
			(obj: ProjectObject): boolean => obj.isa === 'PBXNativeTarget' && obj.name === name
		)
		if (matches.length !== 1 || !matches[0]?.buildConfigurationList) {
			throw new Error(`Expected one generated target with a configuration list: ${name}`)
		}
		const ids: string[] | undefined =
			objects[matches[0].buildConfigurationList]?.buildConfigurations
		if (!ids?.length) throw new Error(`No build configurations for target: ${name}`)
		for (const id of ids) {
			const configuration: ProjectObject | undefined = objects[id]
			if (configuration?.isa !== 'XCBuildConfiguration' || !configuration.buildSettings) {
				throw new Error(`Invalid build configuration: target=${name}, id=${id}`)
			}
			objects[id] = {
				...configuration,
				buildSettings: { ...configuration.buildSettings, ...settings }
			}
		}
	}
	return { ...project, objects }
}
