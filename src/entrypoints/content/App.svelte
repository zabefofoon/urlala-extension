<script lang="ts">
	import { onMount } from 'svelte'
	import { Toaster, toast } from 'svelte-sonner'
	import ToastIcon from './ToastIcon.svelte'

	onMount(() => {
		const handler = (message: { type: string; text?: string }) => {
			if (message.type === 'SAVE_SUCCESS')
				toast(message.text ?? browser.i18n.getMessage('saveSuccess'), { icon: ToastIcon })
		}
		browser.runtime.onMessage.addListener(handler)
		return () => browser.runtime.onMessage.removeListener(handler)
	})
</script>

<Toaster
	position="top-center"
	toastOptions={{
		duration: 1500,
		style:
			'white-space: nowrap; left:50%; translate: -50%; margin: auto; width: fit-content; background: rgba(0,0,0,0.7); color: white; border-radius: 9999px; border: none; font-size: 12px; padding: 8px 16px;'
	}}
/>
