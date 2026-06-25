import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte'],
	manifest: {
		version: '1.0.0',
		homepage_url: 'https://urlala.pages.dev',
		default_locale: 'en',
		name: '__MSG_extensionName__',
		description: '__MSG_extensionDescription__',
		permissions: ['contextMenus', 'tabs', 'storage'],
		web_accessible_resources: [
			{
				resources: ['icon/*.png'],
				matches: ['<all_urls>']
			}
		],
		action: {
			default_icon: {
				16: 'icon/16.png',
				32: 'icon/32.png',
				48: 'icon/48.png',
				96: 'icon/96.png',
				128: 'icon/128.png'
			}
		},
		browser_action: {
			default_icon: {
				16: 'icon/16.png',
				32: 'icon/32.png',
				48: 'icon/48.png',
				96: 'icon/96.png',
				128: 'icon/128.png'
			}
		}
	},
	vite: () => ({
		plugins: [
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide',
				disableAsyncLocalStorage: true,
				strategy: ['preferredLanguage']
			}),
			tailwindcss()
		]
	}),

	// TODO 개발용
	webExt: {
		chromiumArgs: [
			`--user-data-dir=${process.env.HOME}/.wxt-chrome-profile`,
			'--disable-blink-features=AutomationControlled',
			'--exclude-switches=enable-automation'
		]
	}
})
