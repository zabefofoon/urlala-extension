<script lang="ts">
	const { class: classname } = $props<{ class?: string }>()
</script>

<span class={`loader ${classname}`}></span>

<style lang="scss">
	.loader {
		width: 1em;
		height: 1em;
		border: 0.1em solid currentColor;
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
