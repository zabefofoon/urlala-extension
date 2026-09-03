import { browser } from 'wxt/browser'
import { URLALA_BASE_URL } from '@/const'
import { m } from '@/lib/paraglide/messages'
import { localizeHref } from '@/lib/paraglide/runtime'
import { openPermittedLogin } from './loginPermission'

/** Shared login click handler for popup and options pages. */
export async function login(): Promise<void> {
	const url: string = localizeHref(`${URLALA_BASE_URL}/external/login?from=extension`)
	if (!import.meta.env.SAFARI) {
		await browser.tabs.create({ url })
		return
	}

	try {
		const opened: boolean = await openPermittedLogin(
			url,
			URLALA_BASE_URL,
			{
				request: (permissions): Promise<boolean> => browser.permissions.request(permissions),
				openTab: (options): Promise<Browser.tabs.Tab> => browser.tabs.create(options)
			}
		)
		if (!opened) window.alert(m.LoginPermissionRequired())
	} catch (error: unknown) {
		console.error('Unable to open extension login', { origin: URLALA_BASE_URL, error })
		window.alert(m.LoginPermissionFailed())
	}
}
