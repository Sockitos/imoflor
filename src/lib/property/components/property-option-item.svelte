<script lang="ts">
	import type { PropertyType } from '../types';
	import { typeMap } from './property-type-map';

	interface Props {
		type: PropertyType;
		address: string;
		matrix: string;
		indent?: boolean;
	}

	let { type, address, matrix, indent = false }: Props = $props();

	const { icon } = $derived(typeMap[type]);
	const SvelteComponent = $derived(icon);
</script>

<div class="flex flex-row items-center gap-2 {indent ? 'pl-6' : ''}">
	<SvelteComponent class="size-4" />
	<p>
		<span class="text-sm">{address}</span>
		<span class="text-xs text-muted-foreground">({matrix})</span>
	</p>
</div>
