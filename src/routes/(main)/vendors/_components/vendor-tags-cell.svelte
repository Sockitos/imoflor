<script lang="ts">
	import { Badge } from '@/components/ui/badge';

	interface Props {
		tags: string[] | null | undefined;
	}

	let { tags }: Props = $props();
</script>

{#if tags}
	<div class="items-cente flex flex-row gap-x-2">
		{#each tags as tag (tag)}
			<Badge variant="outline">
				{tag}
			</Badge>
		{/each}
	</div>
{/if}
