<script lang="ts">
	import { Mail } from 'lucide-svelte';

	export let email: string | null | undefined;
</script>

<div class="flex flex-row items-center">
	<Mail class="mr-2 h-4 w-4 text-muted-foreground"></Mail>
	{email}
</div>
