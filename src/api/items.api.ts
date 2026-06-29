import type { Item, ItemCursor, Link, PageResponse } from '@/models/Item'
import { apiClient } from './apiClient'

const PAGE_SIZE = 20

export const itemsApi = {
	async findChildrenPage(
		parentId: string,
		userId: string,
		cursor?: ItemCursor
	): Promise<PageResponse> {
		const baseParams = {
			user_id: `eq.${userId}`,
			parent_id: `eq.${parentId}`,
			deleted_at: 'is.null',
			order: 'sort_order.asc,id.asc'
		}

		const pageParams: Record<string, unknown> = { ...baseParams, limit: PAGE_SIZE + 1 }

		if (cursor) {
			pageParams.or = `(sort_order.gt.${cursor.sort_order}),(and(sort_order.eq.${cursor.sort_order},id.gt.${cursor.id}))`
		}

		const itemsRes = await apiClient.get<Item[]>('/rest/v1/url_items', { params: pageParams })

		let total: number | undefined
		if (!cursor) {
			const countRes = await apiClient.get('/rest/v1/url_items', {
				params: { ...baseParams, select: 'id' },
				headers: { Prefer: 'count=exact' }
			})
			const contentRange = countRes.headers['content-range'] as string | undefined
			total = contentRange ? parseInt(contentRange.split('/')[1]) : undefined
		}

		const items = itemsRes.data
		const pageItems = items.slice(0, PAGE_SIZE)
		const lastItem = pageItems.at(-1)

		return {
			items: pageItems,
			nextCursor:
				items.length > PAGE_SIZE && lastItem
					? { id: lastItem.id, sort_order: lastItem.sort_order }
					: undefined,
			total
		}
	},

	async save(item: Item, userId: string) {
		return apiClient.post(
			'/rest/v1/url_items',
			{ ...item, user_id: userId, updated_at: new Date().toISOString() },
			{ headers: { Prefer: 'resolution=merge-duplicates' } }
		)
	},

	async saveMany(items: Item[], userId: string) {
		if (items.length === 0) return
		return apiClient.post(
			'/rest/v1/url_items',
			items.map((item) => ({ ...item, user_id: userId, updated_at: new Date().toISOString() })),
			{ headers: { Prefer: 'resolution=merge-duplicates' } }
		)
	},

	async getAllLinks(folderId: string, userId: string): Promise<Link[]> {
		const res = await apiClient.get<Link[]>('/rest/v1/url_items', {
			params: {
				user_id: `eq.${userId}`,
				parent_id: `eq.${folderId}`,
				type: 'eq.link',
				deleted_at: 'is.null',
				order: 'sort_order.asc,id.asc'
			}
		})

		return res.data
	},

	async find(id: string, userId: string): Promise<Item | undefined> {
		const res = await apiClient.get<Item[]>('/rest/v1/url_items', {
			params: { id: `eq.${id}`, user_id: `eq.${userId}`, limit: 1 }
		})
		return res.data[0]
	},

	async getParents(folderId: string, userId: string): Promise<Item[]> {
		try {
			const res = await apiClient.post<Item[]>('/rest/v1/rpc/get_url_item_parents', {
				target_id: folderId,
				target_parent_id: null,
				target_user_id: userId
			})
			return res.data ?? []
		} catch (error: unknown) {
			const code = (error as { response?: { data?: { code?: string } } })?.response?.data?.code
			if (code !== 'PGRST202') throw error
		}

		// RPC 함수가 없으면 직접 트리를 걸어 올라감
		const parents: Item[] = []
		const visited = new Set<string>([folderId])
		let current = await this.find(folderId, userId)

		while (current?.parent_id && !visited.has(current.parent_id)) {
			visited.add(current.parent_id)
			const parent = await this.find(current.parent_id, userId)
			if (!parent || parent.type !== 'folder') break
			parents.unshift(parent)
			current = parent
		}

		return parents
	}
}
