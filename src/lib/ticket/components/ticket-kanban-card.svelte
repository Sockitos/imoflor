<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import type { Ticket } from '@/ticket/types';
	import { priorityMap } from './ticket-priority-map';
	import { resolve } from '$app/paths';
	import { dateFormatter } from '@/shared/formatters';

	let { ticket }: { ticket: Ticket } = $props();
</script>

<Card class="cursor-grab gap-4 bg-background p-4 select-none active:cursor-grabbing">
	<CardHeader class="gap-2 px-0">
		{@const priority = priorityMap[ticket.priority]}
		<div class="flex items-center justify-between">
			<span class="text-xs text-muted-foreground">{dateFormatter(ticket.date)}</span>
			<Badge variant={priority.variant} class="flex shrink-0 items-center gap-1 text-xs">
				<priority.icon class="h-3 w-3" />
				{priority.label}
			</Badge>
		</div>
		<a
			href={resolve(`/tickets/${ticket.id}`)}
			class="w-fit cursor-pointer text-left text-sm font-medium hover:underline"
		>
			{ticket.title}
		</a>
	</CardHeader>
	<CardContent class="flex flex-col gap-4 p-0">
		<p class="text-xs text-muted-foreground">{ticket.description}</p>
		<p class="text-xs font-medium">{ticket.property.label}</p>
	</CardContent>
</Card>
