import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte'],
	manifest: {
		permissions: ['contextMenus', 'tabs', 'storage']
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
