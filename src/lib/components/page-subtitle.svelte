<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<p class="text-muted-foreground text-sm">{@render children?.()}</p>
