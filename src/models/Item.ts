export const FOLDER_COLORS = ['yellow', 'orange', 'red', 'violet', 'blue', 'green'] as const

export type FolderColor = (typeof FOLDER_COLORS)[number]

export const DEFAULT_FOLDER_COLOR: FolderColor = 'yellow'

export interface BaseItem {
	id: string
	parent_id?: string
	label: string
	type: 'folder' | 'link'
	locked: boolean
	memo?: string
	sort_order: number
	deleted_at?: string
}

export interface Folder extends BaseItem {
	type: 'folder'
	color?: FolderColor
	password?: string
}

export interface Link extends BaseItem {
	type: 'link'
	url: string
	thumbnail?: string
	collectable?: boolean
}

export type Item = Folder | Link

export interface PendingDrop {
	insertAfter: boolean
	relatedItem?: Item
	draggedItem?: Item
}

export interface ItemCursor {
	id: string
	sort_order: number
}

export interface PageResponse {
	items: Item[]
	nextCursor?: ItemCursor
	total?: number
}

export interface CachedFolder extends Folder {
	res?: PageResponse
}

export const PREV_ITEM: Folder = {
	id: 'prev',
	parent_id: undefined,
	label: '..',
	type: 'folder',
	color: DEFAULT_FOLDER_COLOR,
	locked: false,
	sort_order: -1
}
