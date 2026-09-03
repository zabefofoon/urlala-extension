export interface LoginPermissionServices {
	request: (permissions: { origins: string[] }) => Promise<boolean>
	openTab: (options: { url: string }) => Promise<unknown>
}

/** Request immediately in the click handler, before any asynchronous work loses user activation. */
export async function openPermittedLogin(
	url: string,
	origin: string,
	services: LoginPermissionServices
): Promise<boolean> {
	const granted: boolean = await services.request({ origins: [`${origin}/*`] })
	if (!granted) return false
	await services.openTab({ url })
	return true
}
