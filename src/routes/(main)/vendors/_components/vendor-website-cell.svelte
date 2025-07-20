<script lang="ts">
	import { Globe } from 'lucide-svelte';

	interface Props {
		website: string | null | undefined;
	}

	let { website }: Props = $props();
</script>

<div class="flex flex-row items-center">
	<Globe class="text-muted-foreground mr-2 h-4 w-4"></Globe>
	{website}
</div>
