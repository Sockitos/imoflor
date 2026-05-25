<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import type { Intervention } from '@/intervention/types';
	import { typeMap } from './intervention-type-map';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { intervention }: { intervention: Intervention } = $props();

	const interventionType = $derived(typeMap[intervention.type]);
	const formattedStartDate = $derived(
		intervention.start_date
			? intervention.start_date.split('T')[0].split('-').reverse().join('/')
			: null
	);

	function handleClick() {
		goto(resolve(`/interventions/${intervention.id}`));
	}
</script>

<Card class="cursor-grab gap-4 bg-background p-4 select-none active:cursor-grabbing">
	<CardHeader class="gap-2 px-0">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				{#if formattedStartDate}
					<span class="text-xs text-muted-foreground">
						{formattedStartDate}
					</span>
				{/if}
			</div>
			<Badge variant="outline" class="flex shrink-0 items-center gap-1 text-xs">
				<interventionType.icon class="h-3 w-3" />
				{interventionType.label}
			</Badge>
		</div>
		<button
			type="button"
			onclick={handleClick}
			class="w-fit cursor-pointer text-left text-sm font-medium hover:underline"
		>
			{intervention.description}
		</button>
	</CardHeader>
	<CardContent class="flex flex-col gap-4 p-0">
		{#if intervention.ticket}
			<p class="text-xs text-muted-foreground">{intervention.ticket.label}</p>
		{/if}
		<p class="text-xs font-medium">{intervention.property.label}</p>
	</CardContent>
</Card>
