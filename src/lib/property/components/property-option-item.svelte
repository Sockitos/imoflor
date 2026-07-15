<script lang="ts">
	import type { PropertyOption } from '../types';
	import { typeMap } from './property-type-map';

	interface Props {
		option: PropertyOption;
		isSelected: boolean;
	}

	let { option, isSelected }: Props = $props();

	const { icon } = $derived(typeMap[option.type]);
	const SvelteComponent = $derived(icon);
</script>

<div class="flex flex-row items-center gap-2 {!option.children && !isSelected ? 'pl-6' : ''}">
	<SvelteComponent class="size-4" />
	<p>
		<span class="text-sm">
			{isSelected
				? `${option.address + (option.fraction ? `, ${option.fraction}` : '')}`
				: option.fraction
					? option.fraction
					: option.address}
		</span>
		<span class="text-xs text-muted-foreground">({option.matrix})</span>
	</p>
</div>
