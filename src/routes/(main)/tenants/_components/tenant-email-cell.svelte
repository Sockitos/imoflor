<script lang="ts">
	import { Mail } from 'lucide-svelte';

	interface Props {
		email: string | null | undefined;
	}

	let { email }: Props = $props();
</script>

<div class="flex flex-row items-center">
	<Mail class="text-muted-foreground mr-2 h-4 w-4"></Mail>
	{email}
</div>
