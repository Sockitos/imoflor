<script lang="ts">
	import type { MovementType } from '@/types/types';
	import { typeMap } from './movement-type-map';

	interface Props {
		type: MovementType;
	}

	let { type }: Props = $props();

	let { label, icon } = $derived(typeMap[type]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="text-muted-foreground mr-2 h-4 w-4" />
	<span>{label}</span>
</div>
