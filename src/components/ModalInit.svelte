<script lang="ts">
	import { LOCAL_LINKS_KEY } from '@/const'
	import { foldersStore } from '@/stores/folders.svelte'
	import { MessageCircleWarning as IconMessageCircleWarning } from 'lucide-svelte'
	import UIModal from './UIModal.svelte'

	interface Props {
		close: () => void
	}

	const props: Props = $props()

	const empty = async (close: () => void) => {
		await browser.storage.local.remove(LOCAL_LINKS_KEY)
		foldersStore.localLinks = []

		close()
	}
</script>

<UIModal close={props.close}>
	{#snippet inner(close)}
		<div class="flex flex-col items-center justify-center gap-[12px]">
			<IconMessageCircleWarning class="text-red-400" stroke="none" />
			<p class="tracking-tight text-center text-[15px] break-all whitespace-pre-wrap">
				{@html '삭제하면, 복구할 수 없습니다.\n진행 하시겠습니까?'}
			</p>
			<div class="flex w-full items-center gap-[6px]">
				<button
					type="button"
					class="rounded-lg border-border h-[40px] w-full border text-[14px]"
					onclick={close}
				>
					취소
				</button>
				<button
					type="button"
					class="rounded-lg bg-primary text-white h-[40px] w-full border border-transparent text-[14px]"
					onclick={() => empty(close)}
				>
					초기화
				</button>
			</div>
		</div>
	{/snippet}
</UIModal>
