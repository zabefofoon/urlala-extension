<script lang="ts">
	import { LOCAL_LINK_LIMIT, LOCAL_LINKS_KEY } from '@/const'
	import { m } from '@/lib/paraglide/messages.js'
	import type { AddLinkInput, Link } from '@/models/Item'
	import { authStore } from '@/stores/auth.svelte'
	import { foldersStore } from '@/stores/folders.svelte'
	import { Check as IconCheck, X as IconX } from 'lucide-svelte'
	import { onMount } from 'svelte'

	const notifySaveSuccess = async () => {
		const currentFolder = authStore.isLoggedIn ? foldersStore.currentFolder : undefined
		const text = currentFolder
			? browser.i18n.getMessage('saveSuccessInFolder', [currentFolder.label])
			: browser.i18n.getMessage('saveSuccess')

		try {
			const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
			if (tab.id) await browser.tabs.sendMessage(tab.id, { type: 'SAVE_SUCCESS', text })
		} catch {
			// content script가 없는 페이지(chrome://, about:// 등)에서는 무시
		}
	}

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
					return (errorMessage = m.LimitWarning())
				else await foldersStore.addLinkLocal(item)
			} else await foldersStore.addLink(item)
			notifySaveSuccess()
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
						<span class="whitespace-nowrap">{m.TitleLabel()}</span>
					</td>
					<td class="w-full pb-2">
						<input
							bind:value={link.label}
							placeholder={m.TitlePlaceholder()}
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
						{m.Memo()}
					</td>
					<td class="w-full">
						<textarea
							bind:value={link.memo}
							placeholder={m.MemoPlaceholder()}
							class="block min-h-[72px] w-full resize-none rounded-md border border-border px-2 py-2 text-[13px] leading-[1.45] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
						></textarea>
					</td>
				</tr>
			</tbody>
		</table>
		{#if errorMessage}
			<p class="text-red-500 text-[11px] text-center mt-1">{errorMessage}</p>
		{/if}
	</section>

	<section class="mt-auto flex items-center gap-1.5 border-t border-border px-3 py-2">
		<button
			type="button"
			class="ml-auto flex h-6.5 items-center gap-1 rounded-full px-3 text-text-secondary transition hover:bg-surface-elevated"
			onclick={closePopup}
		>
			<IconX size="12px" strokeWidth="3px" />
			<span class="text-[12px] leading-none">{m.Cancel()}</span>
		</button>
		<button
			type="button"
			class="flex h-6.5 items-center gap-1 rounded-full bg-primary pl-2.5 pr-3 text-white shadow-sm transition hover:brightness-95"
			onclick={saveLink}
		>
			<IconCheck size="12px" strokeWidth="3px" />
			<span class="text-[12px] leading-none font-bold">{m.Add()}</span>
		</button>
	</section>
</div>
