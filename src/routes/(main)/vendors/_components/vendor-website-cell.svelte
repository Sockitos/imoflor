<script lang="ts">
	import { Globe } from 'lucide-svelte';

	export let website: string | null | undefined;
</script>

<div class="flex flex-row items-center">
	<Globe class="mr-2 h-4 w-4 text-muted-foreground"></Globe>
	{website}
</div>
