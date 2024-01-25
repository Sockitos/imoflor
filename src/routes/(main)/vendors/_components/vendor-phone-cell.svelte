<script lang="ts">
	import { Phone } from 'lucide-svelte';

	export let phone: string | null | undefined;
</script>

<div class="flex flex-row items-center">
	<Phone class="mr-2 h-4 w-4 text-muted-foreground"></Phone>
	{phone}
</div>
