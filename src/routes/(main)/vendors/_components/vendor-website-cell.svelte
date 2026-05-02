<script lang="ts">
	import { Globe } from 'lucide-svelte';

	interface Props {
		website: string | null | undefined;
	}

	let { website }: Props = $props();
</script>

<div class="flex flex-row items-center">
	<Globe class="mr-2 h-4 w-4 text-muted-foreground"></Globe>
	{website}
</div>
