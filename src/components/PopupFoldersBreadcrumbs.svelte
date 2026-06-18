<script lang="ts">
	import { foldersStore } from '@/stores/folders.svelte'
	import { ChevronRight as IconChevronRight } from 'lucide-svelte'

	// 전체 포함한 전체 경로: ['전체', ...foldersStore.path]
	const allItems = $derived([{ id: 'root', label: '전체' }, ...foldersStore.path])
	const visibleItems = $derived(allItems.slice(-3))
	const isCollapsed = $derived(allItems.length > 3)
</script>

<nav aria-label="Breadcrumb" class="min-w-0">
	<ol class="flex min-w-0 items-center gap-[3px] text-[11px]">
		{#each visibleItems as item, index (item.id)}
			<li class="flex min-w-0 items-center gap-[3px]">
				{#if index === visibleItems.length - 1}
					<span
						class="block max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-text-primary"
					>
						{item.label}
					</span>
				{:else}
					<button
						type="button"
						class="block max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary"
						onclick={() => {
							const allIndex = allItems.findIndex((i) => i.id === item.id)
							if (item.id === 'root') foldersStore.goRoot()
							else foldersStore.navigateTo(allIndex - 1)
						}}
					>
						{isCollapsed && index === 0 ? '..' : item.label}
					</button>
					<IconChevronRight size="11px" class="shrink-0 text-text-secondary" />
				{/if}
			</li>
		{/each}
	</ol>
</nav>
