import { authApi } from '@/api/auth.api'
import { itemsApi } from '@/api/items.api'
import { CACHE_KEY_PREFIX, LOCAL_LINK_LIMIT, LOCAL_LINKS_KEY } from '@/const'
import type { SupabaseUser } from '@/models/Auth'
import type { Folder, Link } from '@/models/Item'

const SAVE_PAGE_MENU_ID = 'urlala-save-page'

type SafariContextMenuCreateProperties = Browser.contextMenus.CreateProperties & {
	icons: Record<number, string>
}

const createSavePageMenu = (): Browser.contextMenus.CreateProperties => {
	const menu: Browser.contextMenus.CreateProperties = {
		id: SAVE_PAGE_MENU_ID,
		title: browser.i18n.getMessage('savePage'),
		contexts: ['page']
	}

	if (!import.meta.env.SAFARI) return menu

	const safariMenu: SafariContextMenuCreateProperties = {
		...menu,
		icons: {
			16: '/icon/16.png',
			32: '/icon/32.png',
			48: '/icon/48.png',
			96: '/icon/96.png',
			128: '/icon/128.png'
		}
	}

	return safariMenu
}

const createLinkFromPage = (input: {
	pageUrl: string
	tabTitle?: string
	favIconUrl?: string
	parentId: string
	sortOrder: number
}): Link => {
	return {
		id: crypto.randomUUID(),
		parent_id: input.parentId,
		label: input.tabTitle?.trim() || input.pageUrl,
		type: 'link',
		url: input.pageUrl,
		thumbnail: input.favIconUrl,
		locked: false,
		sort_order: input.sortOrder,
		collectable: true
	}
}

const savePageToRemote = async (pageUrl: string, tab?: Browser.tabs.Tab) => {
	const { user: cachedUser } = await browser.storage.local.get('user')
	const user = (cachedUser as SupabaseUser | undefined) ?? (await authApi.getUser()).data
	const userId = user?.id
	if (!userId) return false

	const stored = (await browser.storage.local.get('folders_path')) as { folders_path?: Folder[] }
	const path = stored.folders_path ? Array.from(stored.folders_path) : []

	const parentId = path.at(-1)?.id ?? 'root'
	const pageResponse = await itemsApi.findChildrenPage(parentId, userId)
	const items = pageResponse.items
	const firstLinkIndex = items.findIndex((item) => item.type === 'link')
	const insertIndex = firstLinkIndex === -1 ? items.length : firstLinkIndex
	const prevItem = items[insertIndex - 1]
	const nextItem = items[insertIndex]
	const sortOrder =
		prevItem && nextItem
			? (prevItem.sort_order + nextItem.sort_order) / 2
			: prevItem
				? prevItem.sort_order + 1
				: nextItem
					? nextItem.sort_order - 1
					: 0

	const link = createLinkFromPage({
		pageUrl,
		tabTitle: tab?.title,
		favIconUrl: tab?.favIconUrl,
		parentId,
		sortOrder
	})

	await itemsApi.save(link, userId)
	await browser.storage.local.remove(`${CACHE_KEY_PREFIX}${userId}:${parentId}`)

	return true
}

const savePageToLocal = async (pageUrl: string, tab?: Browser.tabs.Tab) => {
	const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
	const savedLinks = ((stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []).filter(
		(link) => !link.deleted_at
	)
	if (savedLinks.length >= LOCAL_LINK_LIMIT) return false

	const nextItem = savedLinks[0]
	const link = createLinkFromPage({
		pageUrl,
		tabTitle: tab?.title,
		favIconUrl: tab?.favIconUrl,
		parentId: 'root',
		sortOrder: nextItem ? nextItem.sort_order - 1 : 0
	})

	await browser.storage.local.set({ [LOCAL_LINKS_KEY]: [link, ...savedLinks] })
	return true
}

const notifySaveSuccess = async (tab?: Browser.tabs.Tab, folderName?: string): Promise<void> => {
	if (!tab?.id) return

	const text = folderName
		? browser.i18n.getMessage('saveSuccessInFolder', [folderName])
		: browser.i18n.getMessage('saveSuccess')

	await browser.tabs
		.sendMessage(tab.id, { type: 'SAVE_SUCCESS', text })
		.catch((error: unknown) => {
			console.warn('Failed to notify save success:', { error })
		})
}

export default defineBackground(() => {
	browser.contextMenus.removeAll().then(() => {
		browser.contextMenus.create(createSavePageMenu())
	})

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		if (info.menuItemId !== SAVE_PAGE_MENU_ID) return

		try {
			const pageUrl = info.pageUrl ?? tab?.url
			if (pageUrl) {
				const { accessToken } = await browser.storage.local.get('accessToken')
				const isSaved = accessToken
					? await savePageToRemote(pageUrl, tab)
					: await savePageToLocal(pageUrl, tab)
				if (isSaved) {
					const stored = (await browser.storage.local.get('folders_path')) as { folders_path?: Folder[] }
					const currentFolder = stored.folders_path ? Array.from(stored.folders_path).at(-1) : undefined
					const folderName = accessToken && currentFolder ? currentFolder.label : undefined
					await notifySaveSuccess(tab, folderName)
				}
				return isSaved
			}
		} catch (error) {
			console.error('Failed to save context menu page:', error)
		}
	})

	// Detect completion of external login and cache auth tokens.
	browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (changeInfo.status !== 'complete') return
		const url = tab.url ?? ''
		if (!url.includes('/external/login/done')) return

		try {
			const hash = new URL(url).hash.slice(1)
			const params = new URLSearchParams(hash)
			const accessToken = params.get('access_token')
			const refreshToken = params.get('refresh_token')

			if (accessToken && refreshToken) {
				await browser.storage.local.set({ accessToken, refreshToken })

				const { authStore } = await import('@/stores/auth.svelte')
				await authStore.load()

				await browser.tabs.remove(tabId)
				browser.runtime.sendMessage({ type: 'AUTH_SUCCESS' }).catch(() => {})
			}
		} catch (error) {
			console.error('Failed to parse auth tokens:', error)
		}
	})
})
