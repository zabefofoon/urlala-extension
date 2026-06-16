<script lang="ts">
  import {
    ArrowUpRight as IconArrowUpRight,
    EllipsisVertical as IconEllipsisVertical,
    Folder as IconFolder,
    FolderPlus as IconFolderPlus,
    GripVertical as IconGripVertical,
    Link as IconLink,
  } from 'lucide-svelte'
  import PopupFoldersBreadcrumbs from './PopupFoldersBreadcrumbs.svelte'
</script>

<div class="flex min-h-0 flex-1 flex-col bg-surface">
  <header class="flex items-center pt-2 px-3">
    <PopupFoldersBreadcrumbs />

    <button type="button" class="ml-auto flex items-center text-primary gap-1">
      <IconFolderPlus size="13px" />
      <span class="text-[11px]">폴더추가</span>
    </button>
  </header>

  <div class="flex flex-col gap-1 pt-2 px-3">
    <div
      class="flex items-center gap-1 bg-surface-elevated py-1.5 px-2 rounded-md"
    >
      <IconFolder size="14px" color="var(--color-text-secondary)" />
      <span class="text-[12px] leading-[100%]">...</span>
    </div>

    <div class="flex items-center gap-1 bg-yellow-100 py-1.5 px-2 rounded-md">
      <IconFolder size="14px" color="var(--color-text-secondary)" />
      <span class="text-[12px] leading-[100%]">새 폴더</span>
      <button type="button" class="expand-hitbox ml-auto">
        <IconEllipsisVertical size="14px" color="var(--color-text-secondary)" />
      </button>
    </div>

    <div
      class="flex items-center gap-1 border border-border py-1.5 px-2 rounded-md"
    >
      <button
        type="button"
        class="drag-handle rounded-sm cursor-grab p-[2px] active:cursor-grabbing"
      >
        <IconGripVertical size="13px" color="var(--color-text-secondary)" />
      </button>

      <IconLink size="14px" color="var(--color-text-secondary)" />
      <span class="text-[12px] leading-[100%]">새 폴더</span>

      <button type="button" class="ml-auto expand-hitbox">
        <IconArrowUpRight size="14px" color="var(--color-text-secondary)" />
      </button>

      <button type="button" class="expand-hitbox">
        <IconEllipsisVertical size="14px" color="var(--color-text-secondary)" />
      </button>
    </div>
  </div>
</div>
