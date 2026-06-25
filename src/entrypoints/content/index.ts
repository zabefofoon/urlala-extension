import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'
import { mount, unmount } from 'svelte'
import App from './App.svelte'

export default defineContentScript({
	matches: ['<all_urls>'],
	cssInjectionMode: 'ui',
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: 'urlala-toast-ui',
			position: 'overlay',
			onMount(container: HTMLElement, _shadow: ShadowRoot, shadowHost: HTMLElement) {
				shadowHost.style.width = '100vw'
				shadowHost.style.pointerEvents = 'none'
				return mount(App, { target: container })
			},
			onRemove(app: ReturnType<typeof mount> | undefined) {
				if (app) unmount(app)
			}
		})
		ui.mount()
	}
})
