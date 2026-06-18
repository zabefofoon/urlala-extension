<script lang="ts">
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import { FolderPlus as IconFolderPlus } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import FileItem from './FileItem.svelte'
	import PopupFoldersBreadcrumbs from './PopupFoldersBreadcrumbs.svelte'

	let loadMoreEl = $state<HTMLElement>()

	$effect(() => {
		if (!loadMoreEl) return
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) foldersStore.loadMore()
		})
		observer.observe(loadMoreEl)
		return () => observer.disconnect()
	})

	onMount(() => {
		if (authStore.isLoggedIn) foldersStore.load()
	})
</script>

<div class="flex min-h-0 flex-1 flex-col bg-surface">
	<header class="flex items-center px-3 pt-2">
		<PopupFoldersBreadcrumbs />
		<button
			type="button"
			class="ml-auto flex shrink-0 items-center gap-1 text-primary"
			onclick={() => foldersStore.addFolder()}
		>
			<IconFolderPlus size="13px" />
			<span class="text-[11px]">폴더추가</span>
		</button>
	</header>

	<div class="flex flex-col overflow-auto px-3 pt-2 pb-2">
		{#if !authStore.isLoggedIn}
			<p class="py-6 text-center text-[12px] text-text-secondary">로그인 후 이용할 수 있습니다.</p>
		{:else if foldersStore.isLoading}
			<div class="flex flex-col gap-1">
				{#each Array(3)}
					<div class="h-8 animate-pulse rounded-md bg-surface-elevated"></div>
				{/each}
			</div>
		{:else if !foldersStore.pageResponse?.items.length}
			<p class="py-6 text-center text-[12px] text-text-secondary">항목이 없습니다.</p>
		{:else}
			<div class="flex flex-col gap-1.5">
				{#each foldersStore.pageResponse.items as item (item.id)}
					<FileItem {item} />
				{/each}
			</div>

			{#if foldersStore.pageResponse?.nextCursor}
				<div bind:this={loadMoreEl} class="h-8 shrink-0"></div>
			{/if}
		{/if}
	</div>
</div>
