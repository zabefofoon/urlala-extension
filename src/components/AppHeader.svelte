<script lang="ts">
	import { URLALA_BASE_URL } from '@/const'
	import { m } from '@/lib/paraglide/messages'
	import { localizeHref } from '@/lib/paraglide/runtime'
	import { cn } from '@/lib/utils/cn'
	import { authStore } from '@/stores/auth.svelte'
	import { Settings as IconSettings } from 'lucide-svelte'

	interface Props {
		selectedMenu: 'add' | 'folders'
		selectMenu: (menu: 'add' | 'folders') => void
		setFolderSelectMode: (value: boolean) => void
	}

	const props: Props = $props()

	const openOptionsPage = async () => {
		try {
			await browser.runtime.openOptionsPage()
		} catch (error) {
			console.error('Failed to open options page:', error)
		}
	}

	const login = async () => {
		await browser.tabs.create({
			url: localizeHref(`${URLALA_BASE_URL}/external/login?from=extension`)
		})
	}
</script>

<header
	class="sticky top-0 left-0 flex items-center border-b border-border pt-1 px-3 pb-1.5 bg-surface"
>
	<div class="flex items-center gap-1.5 shrink-0">
		<img src="/images/logo.webp" alt="Urlala" class="w-[20px]" />
		<p class="font-[600]">Urlala</p>
	</div>
	<div class="flex items-center ml-3 gap-2 shrink-0">
		<button
			type="button"
			class={cn(['relative py-1', { 'text-primary font-bold': props.selectedMenu === 'add' }])}
			onclick={() => {
				props.setFolderSelectMode(false)
				props.selectMenu('add')
			}}
		>
			{#if props.selectedMenu === 'add'}
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[80%] rounded-full bg-primary/10"
				></div>
			{/if}
			<span class="leading-[100%] text-[12px]">{m.Add()}</span>
		</button>
		<button
			type="button"
			class={cn(['relative py-1', { 'text-primary font-bold': props.selectedMenu === 'folders' }])}
			onclick={() => {
				props.setFolderSelectMode(false)
				props.selectMenu('folders')
			}}
		>
			{#if props.selectedMenu === 'folders'}
				<div
					class="absolute top-[calc(50%+1px)] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[80%] rounded-full bg-primary/10"
				></div>
			{/if}
			<span class="leading-[100%] text-[12px]">{m.Folders()}</span>
		</button>
	</div>
	<div class="flex items-center ml-auto overflow-hidden whitespace-nowrap">
		{#if !authStore.isLoading}
			{#if !authStore.isLoggedIn}
				<button
					type="button"
					class="flex items-center bg-primary text-white rounded-full px-2 py-1.5"
					onclick={login}
				>
					<span class="text-[11px] leading-[100%]">{m.Login()}</span>
				</button>
			{:else}
				<button type="button" class="flex items-center w-full overflow-hidden">
					<span class="text-[11px] leading-[100%] tracking-[-0.2px] truncate">
						{authStore.user?.email?.split('@')[0]}
					</span>
				</button>
			{/if}
		{/if}
		<button
			type="button"
			class="text-text-secondary ml-1.5"
			aria-label={m.OpenOptionsPage()}
			title={m.OpenOptionsPage()}
			onclick={openOptionsPage}
		>
			<IconSettings size="16px" />
		</button>
	</div>
</header>
