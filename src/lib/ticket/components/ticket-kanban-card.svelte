<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import type { Ticket } from '@/ticket/types';
	import { priorityMap } from './ticket-priority-map';

	let { ticket }: { ticket: Ticket } = $props();

	const priority = $derived(priorityMap[ticket.priority]);
	const formattedDate = $derived(ticket.date.split('T')[0].split('-').reverse().join('/'));
</script>

<Card class="cursor-grab gap-4 bg-background p-4 select-none active:cursor-grabbing">
	<CardHeader class="gap-2 px-0">
		<div class="flex items-center justify-between">
			<span class="text-xs text-muted-foreground">{formattedDate}</span>
			<Badge variant={priority.variant} class="flex shrink-0 items-center gap-1 text-xs">
				<priority.icon class="h-3 w-3" />
				{priority.label}
			</Badge>
		</div>
		<p class=" text-sm font-medium">
			{ticket.title}
		</p>
	</CardHeader>
	<CardContent class="p-0">
		<p class="text-xs text-muted-foreground">{ticket.description}</p>
		<span class="mt-4 block text-xs font-medium">{ticket.property.label}</span>
	</CardContent>
</Card>
