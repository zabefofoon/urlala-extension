<script lang="ts">
  import { Check, X } from 'lucide-svelte'
</script>

<div class="flex min-h-0 flex-1 flex-col bg-surface">
  <div class="min-h-0 flex-1 px-3 py-3">
    <table class="w-full border-separate border-spacing-y-0">
      <tbody>
        <tr>
          <td class="pr-2 text-[12px] font-medium text-text-secondary pb-2">
            <span class="whitespace-nowrap">제목</span>
          </td>
          <td class="w-full pb-2">
            <input
              placeholder="제목을 입력하세요"
              class="h-9 w-full rounded-md border border-border px-3 text-[13px] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            />
          </td>
        </tr>
        <tr>
          <td
            class="pr-2 pt-2 align-top text-[12px] font-medium text-text-secondary pb-2"
          >
            <span class="whitespace-nowrap">URL</span>
          </td>
          <td class="w-full pb-2">
            <textarea
              placeholder="https://example.com"
              class="block min-h-[72px] w-full resize-none rounded-md border border-border px-2 py-2 text-[13px] leading-[1.45] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            ></textarea>
          </td>
        </tr>
        <tr>
          <td
            class="w-[52px] pr-2 pt-2 align-top text-[12px] font-medium text-text-secondary"
          >
            메모
          </td>
          <td class="w-full">
            <textarea
              placeholder="메모를 입력하세요"
              class="block min-h-[72px] w-full resize-none rounded-md border border-border px-2 py-2 text-[13px] leading-[1.45] text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
            ></textarea>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="mt-auto flex items-center gap-1.5 border-t border-border px-3 py-2"
  >
    <button
      type="button"
      class="ml-auto flex h-6.5 items-center gap-1 rounded-full px-3 text-text-secondary transition hover:bg-surface-elevated"
    >
      <X size="14px" />
      <span class="text-[12px] leading-none">취소</span>
    </button>
    <button
      type="button"
      class="flex h-6.5 items-center gap-1 rounded-full bg-primary px-3 text-white shadow-sm transition hover:brightness-95"
    >
      <Check size="14px" />
      <span class="text-[12px] leading-none">추가</span>
    </button>
  </div>
</div>
