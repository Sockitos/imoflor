<script lang="ts">
	import type { InterventionType } from '@/types/types';
	import { typeMap } from './intervention-type-map';

	interface Props {
		type: InterventionType;
	}

	let { type }: Props = $props();

	let { label, icon } = $derived(typeMap[type]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="text-muted-foreground mr-2 h-4 w-4" />
	<span>{label}</span>
</div>
