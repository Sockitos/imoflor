<script lang="ts">
	import { Phone } from 'lucide-svelte';

	interface Props {
		phone: string | null | undefined;
	}

	let { phone }: Props = $props();
</script>

<div class="flex flex-row items-center">
	<Phone class="mr-2 h-4 w-4 text-muted-foreground"></Phone>
	{phone}
</div>
