<script lang="ts">
	import { Badge } from '@/components/ui/badge';

	export let tags: string[] | null | undefined;
</script>

{#if tags}
	<div class="items-cente flex flex-row gap-x-2">
		{#each tags as tag}
			<Badge variant="outline">
				{tag}
			</Badge>
		{/each}
	</div>
{/if}
