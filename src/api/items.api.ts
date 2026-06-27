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
	}
}
