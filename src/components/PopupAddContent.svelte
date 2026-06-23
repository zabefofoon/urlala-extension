<script lang="ts">
	import { LOCAL_LINK_LIMIT, LOCAL_LINKS_KEY } from '@/const'
	import type { AddLinkInput, Link } from '@/models/Item'
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import { Check as IconCheck, X as IconX } from 'lucide-svelte'
	import { onMount } from 'svelte'

	let link = $state<AddLinkInput>({
		thumbnail: undefined as string | undefined,
		label: undefined as string | undefined,
		memo: undefined as string | undefined,
		url: undefined as string | undefined
	})

	let errorMessage = $state('')

	const loadLink = async () => {
		const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
		link.thumbnail = tab.favIconUrl
		link.label = tab.title
		link.url = tab.url
	}

	const closePopup = () => window.close()

	const saveLink = async () => {
		try {
			const item = $state.snapshot(link)
			if (!authStore.isLoggedIn) {
				const stored = await browser.storage.local.get(LOCAL_LINKS_KEY)
				const savedLinks = ((stored[LOCAL_LINKS_KEY] as Link[] | undefined) ?? []).filter(
					(link) => !link.deleted_at
				)
				if (savedLinks.length >= LOCAL_LINK_LIMIT)
					return (errorMessage = '비로그인 상태에서는 30개까지만 저장됩니다.')
				else await foldersStore.addLinkLocal(item)
			} else await foldersStore.addLink(item)
			closePopup()
		} catch (error) {
			console.error('Failed to save link:', error)
		}
	}

	onMount(() => {
		loadLink()
	})
</script>

<div class="flex min-h-0 flex-1 flex-col bg-surface">
	<section class="min-h-0 flex-1 px-3 py-3">
		<table class="w-full border-separate border-spacing-y-0">
			<tbody>
				<tr>
					<td class="pr-2 text-[12px] font-medium text-text-secondary pb-2">
						<span class="whitespace-nowrap">제목</span>
					</td>
					<td class="w-full pb-2">
						<input
							bind:value={link.label}
							placeholder="제목을 입력하세요"
							class="h-9 w-full rounded-md border border-border px-2 text-[13px] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
						/>
					</td>
				</tr>
				<tr>
					<td class="pr-2 pt-2 align-top text-[12px] font-medium text-text-secondary pb-2">
						<span class="whitespace-nowrap">URL</span>
					</td>
					<td class="w-full pb-2">
						<textarea
							bind:value={link.url}
							placeholder="https://example.com"
							class="block min-h-[72px] w-full resize-none rounded-md border border-border px-2 py-2 text-[13px] leading-[1.45] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
						></textarea>
					</td>
				</tr>
				<tr>
					<td class="w-[52px] pr-2 pt-2 align-top text-[12px] font-medium text-text-secondary">
						메모
					</td>
					<td class="w-full">
						<textarea
							bind:value={link.memo}
							placeholder="메모를 입력하세요"
							class="block min-h-[72px] w-full resize-none rounded-md border border-border px-2 py-2 text-[13px] leading-[1.45] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
						></textarea>
					</td>
				</tr>
			</tbody>
		</table>
		{#if errorMessage}
			<p class="text-red-500 text-[11px] text-center mt-1">asd</p>
		{/if}
	</section>

	<section class="mt-auto flex items-center gap-1.5 border-t border-border px-3 py-2">
		<button
			type="button"
			class="ml-auto flex h-6.5 items-center gap-1 rounded-full px-3 text-text-secondary transition hover:bg-surface-elevated"
			onclick={closePopup}
		>
			<IconX size="12px" strokeWidth="3px" />
			<span class="text-[12px] leading-none">취소</span>
		</button>
		<button
			type="button"
			class="flex h-6.5 items-center gap-1 rounded-full bg-primary pl-2.5 pr-3 text-white shadow-sm transition hover:brightness-95"
			onclick={saveLink}
		>
			<IconCheck size="12px" strokeWidth="3px" />
			<span class="text-[12px] leading-none font-bold">추가</span>
		</button>
	</section>
</div>
