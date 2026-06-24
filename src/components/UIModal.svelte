<script lang="ts">
	import etcUtil from '@/lib/utils/etc'
	import { onMount, type Snippet } from 'svelte'

	let props = $props<{
		close: () => void
		inner?: Snippet<[() => void]>
	}>()

	let dialogEl: HTMLDialogElement
	let modalInnerEl: HTMLDivElement
	let isDragging = $state(false)
	let dragOffsetY = $state(0)
	let dragStartY = 0
	let dragPointerId: number | undefined
	let transitionName = $state<string>('modal-inner')
	let isClosing = $state(false)
	let mounted = false

	const CLOSE_DISTANCE = 20
	const CLOSE_DURATION = 200

	const close = async () => {
		if (isClosing) return

		isClosing = true
		await etcUtil.sleep(CLOSE_DURATION)
		props.close()
	}

	const handleDialogClick = (event: MouseEvent) => {
		if (!mounted) return
		if (event.target !== dialogEl) return
		close()
	}

	const handleDialogCancel = (event: Event) => {
		event.preventDefault()
		close()
	}

	const handleDragStart = (event: PointerEvent) => {
		const target = event.target as HTMLElement
		if (target.closest('button, a')) return

		isDragging = true
		dragOffsetY = 0
		dragStartY = event.clientY
		dragPointerId = event.pointerId
		modalInnerEl?.setPointerCapture(event.pointerId)
	}

	const handleDragMove = (event: PointerEvent) => {
		if (!isDragging || dragPointerId !== event.pointerId) return
		let offsetY = Math.max(0, event.clientY - dragStartY)
		if (offsetY < 20) return
		dragOffsetY = offsetY - 20
		event.preventDefault()
	}

	const finishDrag = (event: PointerEvent) => {
		if (!isDragging || dragPointerId !== event.pointerId) return

		const shouldClose = dragOffsetY >= CLOSE_DISTANCE

		if (shouldClose) {
			dragOffsetY = 100
			close()
		} else dragOffsetY = 0

		isDragging = false
		dragPointerId = undefined
	}

	onMount(() => {
		dialogEl?.showModal()
		dialogEl?.focus()

		etcUtil.sleep(300).then(() => {
			transitionName = 'modal-inner2'
			mounted = true
		})
	})
</script>

<dialog
	bind:this={dialogEl}
	tabindex="-1"
	class="modal dark:text-white/90 flex h-dvh max-h-none w-full max-w-none bg-transparent"
	class:closing={isClosing}
	onclick={handleDialogClick}
	oncancel={handleDialogCancel}
>
	<div
		class="m-auto"
		style={`transform: translateY(${dragOffsetY}px);opacity:${Math.max(0, (CLOSE_DISTANCE - dragOffsetY / 5) / CLOSE_DISTANCE)}`}
	>
		<div
			bind:this={modalInnerEl}
			class={`bg-surface modal-inner ${isClosing ? 'modal-inner-closing' : ''} rounded-xl relative my-[24px] w-[min(320px,calc(100vw-32px))] touch-none p-[16px]`}
			style={`view-transition-name:${transitionName};box-shadow:0 ${Math.max(0, (CLOSE_DISTANCE - dragOffsetY) / CLOSE_DISTANCE) * 5}px ${Math.max(0, (CLOSE_DISTANCE - dragOffsetY) / CLOSE_DISTANCE) * 20}px rgb(0 0 0 / 25%)`}
			role="presentation"
			onpointerdown={handleDragStart}
			onpointermove={handleDragMove}
			onpointerup={finishDrag}
			onpointercancel={finishDrag}
		>
			{@render props.inner?.(close)}
		</div>
	</div>
</dialog>

<style lang="scss">
	.modal {
		&::backdrop {
			background: rgb(0 0 0 / 50%);
		}

		&.closing::backdrop {
			animation: modal-backdrop-out 200ms ease both;
		}

		.modal-inner {
			animation: modal-inner-in 220ms ease both;
		}

		.modal-inner-closing {
			animation: modal-inner-out 200ms ease both;
		}
	}

	:global(::view-transition-old(modal-inner)),
	:global(::view-transition-old(modal-inner2)) {
		animation: modal-inner-out 200ms ease both;
	}

	:global(::view-transition-new(modal-inner)),
	:global(::view-transition-new(modal-inner2)) {
		animation: modal-inner-in 200ms ease both;
	}

	@keyframes modal-inner-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes modal-inner-out {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@keyframes modal-backdrop-out {
		from {
			background: rgb(0 0 0 / 50%);
		}
		to {
			background: rgb(0 0 0 / 0%);
		}
	}
</style>
