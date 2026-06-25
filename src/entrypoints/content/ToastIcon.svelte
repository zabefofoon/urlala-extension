<script lang="ts">
	const src = (browser.runtime.getURL as (path: string) => string)('/icon/32.png')
</script>

<img {src} width="18" height="18" style="border-radius: 3px; flex-shrink: 0;" alt="urlala" />
