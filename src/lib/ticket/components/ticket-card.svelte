<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import type { Ticket } from '@/ticket/types';
	import { priorityMap } from './ticket-priority-map';

	let { ticket }: { ticket: Ticket } = $props();

	const priority = $derived(priorityMap[ticket.priority]);
</script>

<Card class="cursor-grab bg-background shadow-sm select-none active:cursor-grabbing">
	<CardHeader class="p-3 pb-1">
		<p class="line-clamp-1 text-sm leading-snug font-medium">{ticket.title}</p>
	</CardHeader>
	<CardContent class="p-3 pt-1">
		<p class="mb-3 line-clamp-2 text-xs text-muted-foreground">{ticket.description}</p>
		<div class="flex items-center justify-between gap-2">
			<span class="truncate text-xs text-muted-foreground">{ticket.property.label}</span>
			<Badge variant={priority.variant} class="flex shrink-0 items-center gap-1 text-xs">
				<priority.icon class="h-3 w-3" />
				{priority.label}
			</Badge>
		</div>
	</CardContent>
</Card>
