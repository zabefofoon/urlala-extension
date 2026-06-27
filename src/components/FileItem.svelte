<script lang="ts">
	import { cn } from '@/lib/utils/cn'
	import { DEFAULT_FOLDER_COLOR, type Folder, type Item } from '@/models/Item'
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import {
		ArrowUpRight as IconArrowUpRight,
		ChevronRight as IconChevronRight,
		Folder as IconFolder,
		Link as IconLink,
		PackageOpen as IconPackageOpen,
		X as IconX
	} from 'lucide-svelte'

	interface Props {
		item: Item
	}

	const props: Props = $props()

	let isOpeningFolder = $state(false)

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

	const openFolder = async () => {
		if (props.item.type !== 'folder' || props.item.id === 'prev' || isOpeningFolder) return

		isOpeningFolder = true
		try {
			const urls = await foldersStore.getChildLinks(props.item.id)
			if (!urls?.length) return

			await Promise.all(urls.map((url) => browser.tabs.create({ url, active: false })))
			window.close()
		} finally {
			isOpeningFolder = false
		}
	}
</script>

<div class="transition-opacity">
	{#if props.item.type === 'folder'}
		<div class="flex items-center gap-1.5">
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
			{#if props.item.id !== 'prev'}
				<button
					type="button"
					class="border border-border rounded-md p-1"
					disabled={isOpeningFolder}
					onclick={openFolder}
				>
					<IconPackageOpen size="13px" class="shrink-0 text-text-secondary" />
				</button>
			{/if}
		</div>
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
				<div class="h-3.5 w-3.5 shrink-0 rounded-sm bg-surface-elevated grid place-items-center">
					<IconLink size="11px" color="var(--color-text-primary)" />
				</div>
			{/if}
			<span class="flex-1 truncate text-[12px] leading-none">{props.item.label}</span>
			<span class="shrink-0 text-text-secondary transition-colors hover:text-primary">
				<IconArrowUpRight size="13px" />
			</span>
			{#if !authStore.isLoggedIn}
				<button
					type="button"
					class="text-text-secondary"
					onclick={(event) => {
						event.preventDefault()
						foldersStore.removeLocalLink(props.item.id)
					}}
				>
					<IconX size="13px" />
				</button>
			{/if}
		</a>
	{/if}
</div>
