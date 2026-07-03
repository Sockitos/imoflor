<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import type { Intervention } from '@/intervention/types';
	import { typeMap } from './intervention-type-map';
	import { resolve } from '$app/paths';
	import { dateFormatter } from '@/shared/formatters';

	let { intervention }: { intervention: Intervention } = $props();
</script>

<Card class="cursor-grab gap-4 bg-background p-4 select-none active:cursor-grabbing">
	<CardHeader class="gap-2 px-0">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				{#if intervention.start_date}
					<span class="text-xs text-muted-foreground">
						{dateFormatter(intervention.start_date)}
					</span>
				{/if}
			</div>
			<Badge variant="outline" class="flex shrink-0 items-center gap-1 text-xs">
				{@const interventionType = typeMap[intervention.type]}
				<interventionType.icon class="h-3 w-3" />
				{interventionType.label}
			</Badge>
		</div>
		<a
			href={resolve(`/interventions/${intervention.id}`)}
			draggable="false"
			class="w-fit cursor-pointer text-left text-sm font-medium hover:underline"
		>
			{intervention.description}
		</a>
	</CardHeader>
	<CardContent class="flex flex-col gap-4 p-0">
		{#if intervention.ticket}
			<p class="text-xs text-muted-foreground">{intervention.ticket.label}</p>
		{/if}
		<p class="text-xs font-medium">{intervention.property.label}</p>
	</CardContent>
</Card>
