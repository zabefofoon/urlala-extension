import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    permissions: ['contextMenus', 'tabs', 'storage'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),

  // TODO 개발용
  webExt: {
    chromiumArgs: [
      `--user-data-dir=${process.env.HOME}/.wxt-chrome-profile`,
      '--disable-blink-features=AutomationControlled',
      '--exclude-switches=enable-automation',
    ],
  },
});
