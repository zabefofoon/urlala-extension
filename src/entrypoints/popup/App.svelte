<script lang="ts">
	import PopupAddContent from '@/components/PopupAddContent.svelte'
	import PopupFoldersContent from '@/components/PopupFoldersContent.svelte'
	import { authStore } from '@/stores/auth.svelte'
	import { onMount } from 'svelte'
	import AppHeader from '../../components/AppHeader.svelte'

	let selectedMenu = $state<'add' | 'folders'>('add')
	const selectMenu = async (value: 'add' | 'folders') => {
		selectedMenu = value
		await browser.storage.local.set({ selectedMenu: value })
	}

	const browerMessageHandler = (message: { type: string }) => {
		if (message?.type === 'AUTH_SUCCESS') authStore.load()
	}

	const loadStoredMenu = async () => {
		const stored = await browser.storage.local.get('selectedMenu')
		if (stored.selectedMenu === 'add' || stored.selectedMenu === 'folders') {
			selectedMenu = stored.selectedMenu
		}
	}

	onMount(() => {
		loadStoredMenu()
		authStore.load()
		browser.runtime.onMessage.addListener(browerMessageHandler)
		return () => {
			browser.runtime.onMessage.removeListener(browerMessageHandler)
		}
	})
</script>

<main class="w-[320px] aspect-square bg-surface rounded-2xl flex flex-col overscroll-none">
	<AppHeader {selectedMenu} {selectMenu} />
	<div class="flex flex-col flex-1 overflow-hidden">
		{#if selectedMenu === 'add'}
			<PopupAddContent />
		{:else}
			<PopupFoldersContent />
		{/if}
	</div>
</main>
