<script lang="ts">
  import PopupAddContent from '@/components/PopupAddContent.svelte'
  import PopupFoldersContent from '@/components/PopupFoldersContent.svelte'
  import AppHeader from './AppHeader.svelte'

  let selectedMenu = $state<'add' | 'folders'>('add')
  const selectMenu = (value: 'add' | 'folders') => {
    selectedMenu = value
  }
</script>

<main class="w-[320px] min-h-[320px] bg-surface rounded-2xl flex flex-col">
  <AppHeader {selectedMenu} {selectMenu} />
  <div class="flex flex-1">
    {#if selectedMenu === 'add'}
      <PopupAddContent />
    {:else}
      <PopupFoldersContent />
    {/if}
  </div>
</main>
