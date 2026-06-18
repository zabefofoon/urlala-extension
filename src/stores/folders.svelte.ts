import { itemsApi } from '@/api/items.api'
import type { Folder, PageResponse } from '@/models/Item'
import { authStore } from './auth.svelte'

class FoldersStore {
	path = $state<Folder[]>([])
	pageResponse = $state<PageResponse | undefined>()
	isLoading = $state(false)

	get currentFolderId() {
		return this.path.at(-1)?.id ?? 'root'
	}

	get currentFolder() {
		return this.path.at(-1)
	}

	load = async () => {
		const userId = authStore.user?.id
		if (!userId) return

		this.isLoading = true
		try {
			this.pageResponse = await itemsApi.findChildrenPage(this.currentFolderId, userId)
		} catch {
			this.pageResponse = undefined
		} finally {
			this.isLoading = false
		}
	}

	loadMore = async () => {
		const userId = authStore.user?.id
		if (!userId || !this.pageResponse?.nextCursor) return

		const res = await itemsApi.findChildrenPage(
			this.currentFolderId,
			userId,
			this.pageResponse.nextCursor
		)
		if (this.pageResponse) {
			this.pageResponse.items = [...this.pageResponse.items, ...res.items]
			this.pageResponse.nextCursor = res.nextCursor
		}
	}

	enterFolder = (folder: Folder) => {
		this.path.push(folder)
		this.load()
	}

	navigateTo = (index: number) => {
		this.path = this.path.slice(0, index + 1)
		this.load()
	}

	goRoot = () => {
		this.path = []
		this.load()
	}

	addFolder = async () => {
		const userId = authStore.user?.id
		if (!userId) return

		const folder: Folder = {
			id: crypto.randomUUID(),
			parent_id: this.currentFolderId,
			label: '새 폴더',
			type: 'folder',
			color: 'yellow',
			locked: false,
			sort_order: 0
		}

		await itemsApi.save(folder, userId)
		await this.load()
	}
}

export const foldersStore = new FoldersStore()
