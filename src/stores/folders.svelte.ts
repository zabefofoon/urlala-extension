import { itemsApi } from '@/api/items.api'
import { CACHE_KEY_PREFIX, CACHE_TTL_MINUTES, LOCAL_LINKS_KEY, LOCAL_LINK_LIMIT } from '@/const'
import type { AddLinkInput, CacheEntry, Folder, Link, PageResponse } from '@/models/Item'
import dayjs from 'dayjs'
import { authStore } from './auth.svelte'

class FoldersStore {
	path = $state<Folder[]>([])
	pageResponse = $state<PageResponse | undefined>()
	localLinks = $state<Link[]>()
	isLoading = $state(false)
	private isPathInitialized = false

	get currentFolderId() {
		return this.path.at(-1)?.id ?? 'root'
	}

	get currentFolder() {
		return this.path.at(-1)
	}

	private cacheKey(userId: string, folderId: string) {
		return `${CACHE_KEY_PREFIX}${userId}:${folderId}`
	}

	private async readCache(userId: string, folderId: string): Promise<PageResponse | undefined> {
		const key = this.cacheKey(userId, folderId)
		const stored = await browser.storage.local.get(key)
		const entry = stored[key] as CacheEntry | undefined
		if (!entry) return undefined
		if (dayjs().isAfter(dayjs(entry.expires_at))) {
			await browser.storage.local.remove(key)
			return undefined
		}
		return entry.pageResponse
	}

	private async writeCache(userId: string, folderId: string, pageResponse: PageResponse) {
		const key = this.cacheKey(userId, folderId)
		const entry: CacheEntry = {
			pageResponse,
			expires_at: dayjs().add(CACHE_TTL_MINUTES, 'minute').toISOString()
		}
		await browser.storage.local.set({ [key]: entry })
	}

	private async clearCache() {
		const stored = await browser.storage.local.get()
		const cacheKeys = Object.keys(stored).filter((key) => key.startsWith(CACHE_KEY_PREFIX))

		if (cacheKeys.length) await browser.storage.local.remove(cacheKeys)
	}

	private savePath() {
		this.isPathInitialized = true
		browser.storage.local.set({ folders_path: $state.snapshot(this.path) })
	}

	private async initializePath() {
		if (this.isPathInitialized) return

		const stored = (await browser.storage.local.get('folders_path')) as { folders_path: Folder[] }
		if (stored.folders_path) stored.folders_path.length = Object.keys(stored.folders_path).length
		this.path = stored.folders_path ? Array.from(stored.folders_path) : []
		this.isPathInitialized = true
	}

	// 팝업 최초 진입 시 저장된 path를 복원하고, 캐시가 살아있으면 그대로 사용
	async restore() {
		const userId = authStore.user?.id
		if (!userId) return

		await this.initializePath()
		const cached = await this.readCache(userId, this.currentFolderId)
		if (cached) return (this.pageResponse = cached)

		await this.load()
	}

	async load(force?: boolean) {
		const userId = authStore.user?.id
		if (!userId) return

		if (!force) {
			const cached = await this.readCache(userId, this.currentFolderId)
			if (cached) return (this.pageResponse = cached)
		} else await this.clearCache()

		this.isLoading = true
		try {
			const res = await itemsApi.findChildrenPage(this.currentFolderId, userId)
			this.pageResponse = res
			await this.writeCache(userId, this.currentFolderId, res)
		} catch {
			this.pageResponse = undefined
		} finally {
			this.isLoading = false
		}
	}

	async loadMore() {
		const userId = authStore.user?.id
		if (!userId || !this.pageResponse?.nextCursor) return

		const res = await itemsApi.findChildrenPage(
			this.currentFolderId,
			userId,
			this.pageResponse.nextCursor
		)
		if (this.pageResponse) {
			const merged: PageResponse = {
				...res,
				items: [...this.pageResponse.items, ...res.items]
			}
			this.pageResponse = merged
			await this.writeCache(userId, this.currentFolderId, merged)
		}
	}

	async loadLocalLinks() {
		const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
		const savedLinks = ((stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []).filter(
			(link) => !link.deleted_at
		)

		this.localLinks = savedLinks ?? []
	}

	enterFolder(folder: Folder) {
		if (folder.id === 'prev') {
			this.path.pop()
		} else {
			this.path.push(folder)
		}
		this.savePath()
		this.load()
	}

	navigateTo(index: number) {
		this.path = this.path.slice(0, index + 1)
		this.savePath()
		this.load()
	}

	goRoot() {
		this.path = []
		this.savePath()
		this.load()
	}

	async addLink(input: AddLinkInput) {
		const userId = authStore.user?.id
		const rawUrl = input.url?.trim()
		if (!userId || !rawUrl) return false

		await this.initializePath()
		const parentId = this.currentFolderId
		const url: URL = new URL(rawUrl)

		const pageResponse = await itemsApi.findChildrenPage(parentId, userId)
		const items = [...pageResponse.items]
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

		const link: Link = {
			id: crypto.randomUUID(),
			parent_id: parentId,
			label: input.label?.trim() || rawUrl,
			type: 'link',
			url: rawUrl,
			thumbnail: input.thumbnail || new URL('/favicon.ico', url.origin).href,
			locked: false,
			memo: input.memo?.trim() || undefined,
			sort_order: sortOrder,
			collectable: true
		}

		await itemsApi.save(link, userId)
		items.splice(insertIndex, 0, link)

		await browser.storage.local.remove(`${CACHE_KEY_PREFIX}${userId}:${parentId}`)

		return true
	}

	async addLinkLocal(input: AddLinkInput) {
		const rawUrl = input.url?.trim()
		if (!rawUrl) return false

		const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
		const savedLinks = ((stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []).filter(
			(link) => !link.deleted_at
		)
		if (savedLinks.length >= LOCAL_LINK_LIMIT) return false

		const nextItem = savedLinks[0]
		const link: Link = {
			id: crypto.randomUUID(),
			parent_id: 'root',
			label: input.label?.trim() || rawUrl,
			type: 'link',
			url: rawUrl,
			thumbnail: input.thumbnail,
			locked: false,
			memo: input.memo?.trim() || undefined,
			sort_order: nextItem ? nextItem.sort_order - 1 : 0,
			collectable: true
		}

		await browser.storage.local.set({ [LOCAL_LINKS_KEY]: [link, ...savedLinks] })
		return true
	}

	async removeLocalLink(id: string) {
		const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
		const savedLinks = (stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []
		const nextLinks = savedLinks.filter((link) => link.id !== id)

		await browser.storage.local.set({ [LOCAL_LINKS_KEY]: nextLinks })
		this.localLinks = nextLinks.filter((link) => !link.deleted_at)
	}

	async migrate() {
		const userId = authStore.user?.id
		if (!userId) return false

		const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
		const savedLinks = ((stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []).filter(
			(link) => !link.deleted_at
		)
		if (savedLinks.length === 0) return false

		await itemsApi.saveMany(savedLinks, userId)
		await browser.storage.local.remove(LOCAL_LINKS_KEY)
		this.localLinks = []

		return true
	}

	async getChildLinks(folderId: string) {
		if (!authStore.user?.id) return
		const res = await itemsApi.getAllLinks(folderId, authStore.user?.id)
		return res.map((link) => link.url)
	}
}

export const foldersStore = new FoldersStore()
