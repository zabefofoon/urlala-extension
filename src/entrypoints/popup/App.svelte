<script lang="ts">
  import PopupAddContent from '@/components/PopupAddContent.svelte'
  import PopupFoldersContent from '@/components/PopupFoldersContent.svelte'
  import { cn } from '@/lib/utils/cn'
  import { Settings as IconSettings } from 'lucide-svelte'

  let selectedMenu = $state<'add' | 'folders'>('add')
</script>

<main class="w-[320px] min-h-[320px] bg-surface rounded-2xl flex flex-col">
  <div class="flex items-center border-b border-border pt-1 px-3 pb-1.5">
    <div class="flex items-center gap-1.5">
      <img src="/images/logo.webp" alt="Urlala" class="w-[20px]" />
      <p class="font-[600]">Urlala</p>
    </div>
    <div class="flex items-center ml-3 gap-1.5">
      <button
        type="button"
        class={cn([
          'py-1',
          { 'text-primary underline': selectedMenu === 'add' },
        ])}
        onclick={() => (selectedMenu = 'add')}
      >
        <span class="leading-[100%] text-[12px]">추가</span>
      </button>
      <button
        type="button"
        class={cn([
          'py-1',
          { 'text-primary underline': selectedMenu === 'folders' },
        ])}
        onclick={() => (selectedMenu = 'folders')}
      >
        <span class="leading-[100%] text-[12px]">폴더</span>
      </button>
    </div>
    <div class="flex items-center ml-auto">
      {#if true}
        <button
          type="button"
          class="flex items-center bg-primary text-white rounded-full px-2 py-1.5"
        >
          <span class="text-[11px] leading-[100%]">로그인</span>
        </button>
      {:else}
        <button type="button" class="flex items-center">
          <span class="text-[11px] leading-[100%]">Hello, zabefofoon</span>
        </button>
      {/if}
      <button type="button" class="text-text-secondary ml-1.5">
        <IconSettings size="16px" />
      </button>
    </div>
  </div>
  <div class="flex flex-1">
    {#if selectedMenu === 'add'}
      <PopupAddContent />
    {:else}
      <PopupFoldersContent />
    {/if}
  </div>
</main>
