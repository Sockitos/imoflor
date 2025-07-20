<script lang="ts">
	import { Phone } from 'lucide-svelte';

	interface Props {
		phone: string | null | undefined;
	}

	let { phone }: Props = $props();
</script>

<div class="flex flex-row items-center">
	<Phone class="text-muted-foreground mr-2 h-4 w-4"></Phone>
	{phone}
</div>
