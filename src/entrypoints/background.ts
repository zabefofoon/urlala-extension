export default defineBackground(() => {
	console.log('Hello background!', { id: browser.runtime.id })

	browser.contextMenus.removeAll().then(() => {
		browser.contextMenus.create({
			id: 'urlala-save-page',
			title: 'Urlala에 현재 페이지 저장',
			contexts: ['page']
		})
	})

	browser.contextMenus.onClicked.addListener(async (info, tab) => {
		if (info.menuItemId === 'urlala-save-page') {
			console.log('Dummy context menu save:', {
				pageUrl: info.pageUrl,
				tabTitle: tab?.title
			})
			return
		}
	})

	// 구글 로그인 완료 탭 감지
	browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (changeInfo.status !== 'complete') return
		const url = tab.url ?? ''
		if (!url.includes('/external/login/done')) return

		try {
			const hash = new URL(url).hash.slice(1) // '#' 제거
			const params = new URLSearchParams(hash)
			const accessToken = params.get('access_token')
			const refreshToken = params.get('refresh_token')

			if (accessToken && refreshToken) {
				await browser.storage.local.set({ accessToken, refreshToken })

				const { authStore } = await import('@/stores/auth.svelte')
				await authStore.load()

				await browser.tabs.remove(tabId)
				browser.runtime.sendMessage({ type: 'AUTH_SUCCESS' }).catch(() => {})
			}
		} catch (e) {
			console.error('Failed to parse auth tokens:', e)
		}
	})
})
