<script lang="ts">
	import { URLALA_BASE_URL } from '@/const'
	import { PREV_ITEM } from '@/models/Item'
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import { ChevronRight as IconChevronRight, RefreshCw as IconRefresh } from 'lucide-svelte'
	import FileItem from './FileItem.svelte'
	import PopupFoldersBreadcrumbs from './PopupFoldersBreadcrumbs.svelte'

	let loadMoreEl = $state<HTMLElement>()

	const moveToUrlala = async () => {
		const { accessToken } = await browser.storage.local.get(['accessToken'])

		const url = accessToken
			? `${URLALA_BASE_URL}/external/login/token?accessToken=${encodeURIComponent(accessToken as string)}`
			: `${URLALA_BASE_URL}/folder/root`

		browser.tabs.create({ url })
		window.close()
	}

	const refresh = () => {
		foldersStore.goRoot()
		if (authStore.isLoggedIn) foldersStore.load(true)
	}

	const items = $derived.by(() => {
		const items = foldersStore.pageResponse?.items ?? []
		return foldersStore.path.length ? [PREV_ITEM, ...items] : items
	})

	$effect(() => {
		if (!loadMoreEl) return
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) foldersStore.loadMore()
		})
		observer.observe(loadMoreEl)
		return () => observer.disconnect()
	})

	$effect(() => {
		if (authStore.user) foldersStore.restore()
	})
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<div class="flex-1 flex flex-col overflow-auto">
		{#if foldersStore.pageResponse?.items.length}
			<header class="flex items-center px-3 pt-2 shrink-0">
				<PopupFoldersBreadcrumbs />
				<button
					type="button"
					class="gap-1 ml-auto flex items-center text-primary"
					onclick={refresh}
				>
					<IconRefresh size="12px" />
					<span class="text-[11px] tracking-[-0.2px]">새로고침</span>
				</button>
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
			{:else if !items.length}
				<p class="py-6 text-center text-[12px] text-text-secondary">항목이 없습니다.</p>
			{:else}
				<div class="flex flex-col gap-1.5">
					{#each items as item (item.id)}
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
		{#if authStore.isLoggedIn}
			<p class="text-[12px]">
				파일 관리는 <button
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
				<IconChevronRight size="12px" strokeWidth="3px" />
			</button>
		{:else}
			<p class="w-full text-[12px] text-center text-text-secondary">
				파일 관리는
				<button
					class="text-primary underline"
					onclick={() =>
						browser.tabs.create({ url: `${URLALA_BASE_URL}/external/login?from=extension` })}
				>
					로그인 후
				</button>
				해주세요.
			</p>
		{/if}
	</footer>
</div>
