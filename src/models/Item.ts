export const FOLDER_COLORS = ['yellow', 'orange', 'red', 'violet', 'blue', 'green'] as const

export type FolderColor = (typeof FOLDER_COLORS)[number]

export const DEFAULT_FOLDER_COLOR: FolderColor = 'yellow'
