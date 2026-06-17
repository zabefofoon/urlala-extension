export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id })

  browser.contextMenus.removeAll().then(() => {
    browser.contextMenus.create({
      id: 'urlala-save-page',
      title: 'Urlala에 현재 페이지 저장',
      contexts: ['page'],
    })
  })

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'urlala-save-page') {
      console.log('Dummy context menu save:', {
        pageUrl: info.pageUrl,
        tabTitle: tab?.title,
      })
      return
    }

    if (info.menuItemId === 'urlala-open-options') {
      await browser.runtime.openOptionsPage()
      return
    }

    if (info.menuItemId === 'urlala-open-sidepanel' && tab?.id != null) {
      await browser.sidePanel.open({ tabId: tab.id })
    }
  })
})
