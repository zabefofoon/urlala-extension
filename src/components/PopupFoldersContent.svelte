<script lang="ts">
	import { PREV_ITEM } from '@/models/Item'
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import { ChevronRight } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import FileItem from './FileItem.svelte'
	import PopupFoldersBreadcrumbs from './PopupFoldersBreadcrumbs.svelte'
	let loadMoreEl = $state<HTMLElement>()

	const moveToUrlala = () => {
		browser.tabs.create({ url: `https://urlala.pages.dev/folder/root` })
		window.close()
	}

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

	$effect(() => {
		if (authStore.isLoggedIn) foldersStore.load()
	})
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<div class="flex-1 flex flex-col overflow-auto">
		{#if foldersStore.pageResponse?.items.length}
			<header class="flex items-center px-3 pt-2 shrink-0">
				<PopupFoldersBreadcrumbs />
			</header>
		{/if}

		<div class="flex flex-col px-3 py-2 h-full">
			{#if !authStore.isLoggedIn}
				<p class="py-6 text-center text-[12px] text-text-secondary">
					로그인 후 이용할 수 있습니다.
				</p>
			{:else if foldersStore.isLoading}
				<div class="flex flex-col gap-1">
					{#each Array(2)}
						<div class="h-8 animate-pulse rounded-md bg-surface-elevated"></div>
					{/each}
				</div>
			{:else if !foldersStore.pageResponse?.items.length}
				<p class="py-6 text-center text-[12px] text-text-secondary">항목이 없습니다.</p>
			{:else}
				<div class="flex flex-col gap-1.5">
					{#if foldersStore.path.length}
						<FileItem item={PREV_ITEM} />
					{/if}

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

	<footer
		class="shrink-0 bg-surface px-3 py-2 flex items-center justify-between border-t border-border"
	>
		<p class="text-[12px]">
			폴더 관리는 <button
				type="button"
				class="inline text-primary underline font-bold"
				onclick={moveToUrlala}
			>
				Urlala
			</button>
			에서 해주세요.
		</p>
		<button
			type="button"
			class="flex h-6.5 items-center gap-1 rounded-full bg-primary pl-2.5 pr-3 text-white shadow-sm transition hover:brightness-95"
			onclick={moveToUrlala}
		>
			<span class="text-[12px] leading-none font-bold">이동</span>
			<ChevronRight size="12px" strokeWidth="3px" />
		</button>
	</footer>
</div>
