<script lang="ts">
	import { cn } from '@/lib/utils/cn'
	import { DEFAULT_FOLDER_COLOR, type Folder, type Item } from '@/models/Item'
	import { foldersStore } from '@/stores/folders.svelte'
	import {
		ArrowUpRight as IconArrowUpRight,
		ChevronRight as IconChevronRight,
		Folder as IconFolder
	} from 'lucide-svelte'

	interface Props {
		item: Item
	}

	const props: Props = $props()

	const folderColor = $derived(
		props.item.type === 'folder'
			? `bg-folder-${props.item.color ?? DEFAULT_FOLDER_COLOR}`
			: undefined
	)
	const borderColor = $derived.by(() => {
		if (props.item.id === 'prev') return 'border-border'
		return props.item.type === 'folder'
			? `border-folder-border-${props.item.color ?? DEFAULT_FOLDER_COLOR} dark:border-folder-${props.item.color ?? DEFAULT_FOLDER_COLOR}`
			: undefined
	})
</script>

<div class="transition-opacity">
	{#if props.item.type === 'folder'}
		<button
			type="button"
			class={cn([
				'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-all hover:brightness-95 ',
				{
					[`${folderColor} ${borderColor} border dark:bg-transparent`]:
						props.item.type === 'folder',
					'bg-surface-elevated': props.item.id === 'prev'
				}
			])}
			onclick={() => foldersStore.enterFolder(props.item as Folder)}
		>
			<IconFolder size="14px" class="shrink-0 text-text-secondary" />
			<span class="flex-1 truncate text-[12px] leading-none">{props.item.label}</span>
			<IconChevronRight size="13px" class="shrink-0 text-text-secondary" />
		</button>
	{:else}
		<a
			class="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5"
			href={props.item.url}
			target="_blank"
			rel="noopener noreferrer"
			onclick={(e) => e.stopPropagation()}
		>
			{#if props.item.thumbnail}
				<img
					src={props.item.thumbnail}
					alt=""
					class="h-3.5 w-3.5 shrink-0 rounded-sm object-contain"
				/>
			{:else}
				<div class="h-3.5 w-3.5 shrink-0 rounded-sm bg-surface-elevated"></div>
			{/if}
			<span class="flex-1 truncate text-[12px] leading-none">{props.item.label}</span>
			<span class="shrink-0 text-text-secondary transition-colors hover:text-primary">
				<IconArrowUpRight size="13px" />
			</span>
		</a>
	{/if}
</div>
