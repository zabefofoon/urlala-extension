<script lang="ts">
	import { cn } from '@/lib/utils/cn'
	import type { Folder, Item } from '@/models/Item'
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

	const FOLDER_BG: Record<string, string> = {
		yellow: 'bg-yellow-100',
		orange: 'bg-orange-100',
		red: 'bg-red-100',
		violet: 'bg-violet-100',
		blue: 'bg-blue-100',
		green: 'bg-green-100'
	}
</script>

<div class="transition-opacity">
	{#if props.item.type === 'folder'}
		<button
			type="button"
			class={cn([
				'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-all hover:brightness-95 ',
				FOLDER_BG[props.item.color ?? 'yellow'],
				{ 'bg-surface-elevated': props.item.id === 'prev' }
			])}
			onclick={() => foldersStore.enterFolder(props.item as Folder)}
		>
			<IconFolder size="14px" class="shrink-0 text-text-secondary" />
			<span class="flex-1 truncate text-[12px] leading-none">{props.item.label}</span>
			<IconChevronRight size="13px" class="shrink-0 text-text-secondary" />
		</button>
	{:else}
		<div class="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5">
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
			<a
				href={props.item.url}
				target="_blank"
				rel="noopener noreferrer"
				class="shrink-0 text-text-secondary transition-colors hover:text-primary"
				onclick={(e) => e.stopPropagation()}
			>
				<IconArrowUpRight size="13px" />
			</a>
		</div>
	{/if}
</div>
