<script lang="ts">
	import type { Snippet } from 'svelte'

	let props = $props<{
		id: string
		trigger?: Snippet
		menus?: Snippet
	}>()
	let menuEl = $state<HTMLDivElement>()

	const openMenus = (event: MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
		menuEl?.showPopover()
	}

	const handleDimClick = (event: MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
		menuEl?.hidePopover()
	}

	const handleMenusClick = (event: Event) => {
		event.stopPropagation()
		event.preventDefault()
		menuEl?.hidePopover()
	}
</script>

<div class="dropdown">
	<button class="dim" onclick={handleDimClick}>
		<span class="sr-only">dim</span>
	</button>
	<button
		type="button"
		class="expand-hitbox menu-anchor block"
		style={`anchor-name: --dropdown-anchor-${props.id};`}
		popovertarget={`dropdown-${props.id}`}
		onclick={openMenus}
	>
		{@render props.trigger?.({ openMenus })}
	</button>
	<div
		bind:this={menuEl}
		id={`dropdown-${props.id}`}
		popover="manual"
		class="menus border-border dark:border-zinc-700 bg-surface dark:bg-zinc-800 top-0 right-0 dark:text-white/90 absolute min-w-[80px] rounded-[12px] border p-[4px]"
		style={`position-anchor: --dropdown-anchor-${props.id};`}
		onclick={handleMenusClick}
		onkeydown={handleMenusClick}
		role="button"
		tabindex="0"
	>
		{@render props.menus?.()}
	</div>
</div>

<style lang="scss">
	.dropdown {
		position: relative;
		.dim {
			display: none;
			position: fixed;
			inset: 0;
			z-index: 10;
		}
		&:has(:popover-open) {
			.dim {
				display: block;
			}
		}

		.menus {
			opacity: 0;
			transform: translate(-100%, -6px) scale(0.98);
			transition:
				opacity 160ms ease,
				transform 160ms ease,
				display 160ms allow-discrete,
				overlay 160ms allow-discrete;

			&:popover-open {
				opacity: 1;
				transform: translate(-100%, 0) scale(1);
			}

			@supports (anchor-name: --a) {
				top: anchor(bottom);
				left: anchor(center);
			}
		}

		@starting-style {
			.menus {
				&:popover-open {
					opacity: 0;
					transform: translate(-100%, -6px) scale(0.98);
				}
			}
		}
	}
</style>
