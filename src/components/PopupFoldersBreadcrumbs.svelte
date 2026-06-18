<script lang="ts">
	import { foldersStore } from '@/stores/folders.svelte'
	import { ChevronRight as IconChevronRight } from 'lucide-svelte'
</script>

<div class="flex min-w-0 items-center gap-0.5 overflow-hidden">
	<button
		type="button"
		class="shrink-0 text-[11px] text-text-secondary transition-colors hover:text-text-primary"
		onclick={() => foldersStore.goRoot()}
	>
		전체
	</button>
	{#each foldersStore.path as folder, i}
		<IconChevronRight size="11px" class="shrink-0 text-text-secondary" />
		<button
			type="button"
			class="truncate text-[11px] text-text-secondary transition-colors hover:text-text-primary"
			onclick={() => foldersStore.navigateTo(i)}
		>
			{folder.label}
		</button>
	{/each}
</div>
