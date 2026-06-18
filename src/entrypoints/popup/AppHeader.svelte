<script lang="ts">
  import { cn } from '@/lib/utils/cn'
  import { Settings as IconSettings } from 'lucide-svelte'
  import { authStore } from '@/stores/auth.svelte'

  interface Props {
    selectedMenu: 'add' | 'folders'
    selectMenu: (menu: 'add' | 'folders') => void
  }

  const props: Props = $props()

  const URLALA_BASE_URL = 'http://localhost:5173'

  const openOptionsPage = async () => {
    try {
      await browser.runtime.openOptionsPage()
    } catch (error) {
      console.error('Failed to open options page:', error)
    }
  }

  const login = async () => {
    await browser.tabs.create({ url: `${URLALA_BASE_URL}/external/login?from=extension` })
  }

  const logout = async () => {
    await authStore.clearTokens()
  }
</script>

<header class="flex items-center border-b border-border pt-1 px-3 pb-1.5">
  <div class="flex items-center gap-1.5">
    <img src="/images/logo.webp" alt="Urlala" class="w-[20px]" />
    <p class="font-[600]">Urlala</p>
  </div>
  <div class="flex items-center ml-3 gap-2">
    <button
      type="button"
      class={cn([
        'py-1',
        { 'text-primary underline': props.selectedMenu === 'add' },
      ])}
      onclick={() => props.selectMenu('add')}
    >
      <span class="leading-[100%] text-[12px]">추가</span>
    </button>
    <button
      type="button"
      class={cn([
        'py-1',
        { 'text-primary underline': props.selectedMenu === 'folders' },
      ])}
      onclick={() => props.selectMenu('folders')}
    >
      <span class="leading-[100%] text-[12px]">폴더</span>
    </button>
  </div>
  <div class="flex items-center ml-auto">
    {#if !authStore.isLoggedIn}
      <button
        type="button"
        class="flex items-center bg-primary text-white rounded-full px-2 py-1.5"
        onclick={login}
      >
        <span class="text-[11px] leading-[100%]">로그인</span>
      </button>
    {:else}
      <button type="button" class="flex items-center" onclick={logout}>
        <span class="text-[11px] leading-[100%]">로그아웃</span>
      </button>
    {/if}
    <button
      type="button"
      class="text-text-secondary ml-1.5"
      aria-label="옵션 페이지 열기"
      title="옵션 페이지 열기"
      onclick={openOptionsPage}
    >
      <IconSettings size="16px" />
    </button>
  </div>
</header>
