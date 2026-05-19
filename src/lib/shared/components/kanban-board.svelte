<script lang="ts">
	import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
	import { Badge } from '@/shared/components/ui/badge';
	import { Button } from '@/shared/components/ui/button';
	import {
		GripVertical,
		Plus,
		CircleDashed,
		CircleDot,
		CheckCircle2,
		XCircle,
		ArrowDownIcon,
		ArrowRightIcon,
		ArrowUpIcon,
	} from 'lucide-svelte';
	import type { Component } from 'svelte';
	import type { Ticket, TicketStatus } from '@/ticket/types';

	const mockTickets: Ticket[] = [
		{
			id: 1,
			date: '2026-05-01',
			priority: 'high',
			status: 'open',
			title: 'Fix leaking pipe in unit 3B',
			description:
				'Tenant reported a leaking pipe under the kitchen sink. Needs urgent inspection.',
			property: { id: 1, label: '12 Maple Street' },
		},
		{
			id: 2,
			date: '2026-05-03',
			priority: 'medium',
			status: 'open',
			title: 'Replace broken window latch',
			description:
				'Window latch on the second floor bedroom is broken and cannot be locked properly.',
			property: { id: 2, label: '45 Oak Avenue' },
		},
		{
			id: 3,
			date: '2026-05-05',
			priority: 'low',
			status: 'open',
			title: 'Repaint hallway walls',
			description:
				'Hallway walls on the third floor need a fresh coat of paint. Tenant requested neutral color.',
			property: { id: 1, label: '12 Maple Street' },
		},
		{
			id: 4,
			date: '2026-05-06',
			priority: 'medium',
			status: 'open',
			title: 'Install additional parking sign',
			description:
				'Residents are confused about visitor parking rules. A new sign is needed at the entrance.',
			property: { id: 3, label: '8 Pine Road' },
		},
		{
			id: 5,
			date: '2026-05-02',
			priority: 'high',
			status: 'in_progress',
			title: 'Elevator annual maintenance',
			description: 'Scheduled yearly elevator inspection and maintenance by certified technician.',
			property: { id: 2, label: '45 Oak Avenue' },
		},
		{
			id: 6,
			date: '2026-05-04',
			priority: 'medium',
			status: 'in_progress',
			title: 'HVAC filter replacement',
			description: 'All HVAC units across floors 2–5 are due for filter replacement this month.',
			property: { id: 1, label: '12 Maple Street' },
		},
		{
			id: 7,
			date: '2026-05-07',
			priority: 'low',
			status: 'in_progress',
			title: 'Update intercom directory',
			description:
				'New tenants have moved in and the intercom directory listing needs to be updated.',
			property: { id: 3, label: '8 Pine Road' },
		},
		{
			id: 8,
			date: '2026-04-20',
			priority: 'high',
			status: 'resolved',
			title: 'Water heater replacement',
			description:
				'Old water heater in the basement was replaced with a new energy-efficient unit.',
			property: { id: 2, label: '45 Oak Avenue' },
		},
		{
			id: 9,
			date: '2026-04-25',
			priority: 'medium',
			status: 'resolved',
			title: 'Fix garage door sensor',
			description:
				'Garage door sensor was misaligned causing it to stay open. Sensor realigned and tested.',
			property: { id: 3, label: '8 Pine Road' },
		},
		{
			id: 10,
			date: '2026-04-15',
			priority: 'low',
			status: 'cancelled',
			title: 'Add rooftop garden furniture',
			description:
				'Proposal to add seating to the rooftop area was cancelled due to budget constraints this quarter.',
			property: { id: 1, label: '12 Maple Street' },
		},
	];

	// let { tickets = mockTickets }: { tickets: Ticket[] } = $props();
	let tickets = mockTickets;

	type IconComponent = Component<{ class?: string }>;

	const statusMap: Record<TicketStatus, { label: string; icon: IconComponent }> = {
		open: { label: 'Open', icon: CircleDashed as unknown as IconComponent },
		in_progress: { label: 'In Progress', icon: CircleDot as unknown as IconComponent },
		resolved: { label: 'Resolved', icon: CheckCircle2 as unknown as IconComponent },
		cancelled: { label: 'Cancelled', icon: XCircle as unknown as IconComponent },
	};

	const priorityMap: Record<
		Ticket['priority'],
		{ label: string; icon: IconComponent; variant: 'secondary' | 'outline' | 'destructive' }
	> = {
		low: { label: 'Low', icon: ArrowDownIcon as unknown as IconComponent, variant: 'secondary' },
		medium: {
			label: 'Medium',
			icon: ArrowRightIcon as unknown as IconComponent,
			variant: 'outline',
		},
		high: { label: 'High', icon: ArrowUpIcon as unknown as IconComponent, variant: 'destructive' },
	};

	const ALL_STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'cancelled'];

	let columnOrder = $state<TicketStatus[]>([...ALL_STATUSES]);
	let localTickets = $state<Ticket[]>([...tickets]);

	let draggingCardId = $state<number | null>(null);
	let draggingColumnId = $state<TicketStatus | null>(null);
	let dragOverColumnId = $state<TicketStatus | null>(null);
	let dragOverCardId = $state<number | null>(null);
	let dragOverPosition = $state<'before' | 'after'>('before');

	let previewTickets = $derived.by(() => {
		if (draggingCardId === null) return localTickets;

		const draggingTicket = localTickets.find((t) => t.id === draggingCardId);
		if (!draggingTicket) return localTickets;

		const withoutDragging = localTickets.filter((t) => t.id !== draggingCardId);

		const dragOverCardInColumn =
			dragOverCardId !== null &&
			localTickets.find((t) => t.id === dragOverCardId)?.status === dragOverColumnId;

		if (dragOverCardId !== null && dragOverColumnId !== null && dragOverCardInColumn) {
			const updatedTicket = { ...draggingTicket, status: dragOverColumnId };
			const targetIndex = withoutDragging.findIndex((t) => t.id === dragOverCardId);
			if (targetIndex === -1) return localTickets;
			const insertIndex = dragOverPosition === 'after' ? targetIndex + 1 : targetIndex;
			const result = [...withoutDragging];
			result.splice(insertIndex, 0, updatedTicket);
			return result;
		} else if (dragOverColumnId !== null) {
			const updatedTicket = { ...draggingTicket, status: dragOverColumnId };
			let lastColIndex = -1;
			for (let i = 0; i < withoutDragging.length; i++) {
				if (withoutDragging[i].status === dragOverColumnId) lastColIndex = i;
			}
			const result = [...withoutDragging];
			result.splice(lastColIndex + 1, 0, updatedTicket);
			return result;
		}

		return localTickets;
	});

	function ticketsForColumn(status: TicketStatus): Ticket[] {
		return previewTickets.filter((t) => t.status === status);
	}

	// --- Card DnD ---
	function onCardDragStart(e: DragEvent, cardId: number, sourceColumn: TicketStatus) {
		draggingCardId = cardId;
		draggingColumnId = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('type', 'card');
			e.dataTransfer.setData('cardId', String(cardId));
			e.dataTransfer.setData('sourceColumn', sourceColumn);
		}
	}

	function onCardDragEnd() {
		draggingCardId = null;
		draggingColumnId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function onCardDragOver(e: DragEvent, cardId: number, targetColumn: TicketStatus) {
		if (draggingColumnId !== null) return;
		if (cardId === draggingCardId) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverCardId = cardId;
		dragOverColumnId = targetColumn;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		dragOverPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
	}

	function onCardDrop(e: DragEvent, targetCardId: number, targetColumn: TicketStatus) {
		e.preventDefault();
		e.stopPropagation();
		if (!e.dataTransfer) return;
		const type = e.dataTransfer.getData('type');
		if (type !== 'card') return;

		localTickets = [...previewTickets];

		draggingCardId = null;
		dragOverCardId = null;
		dragOverColumnId = null;
	}

	// --- Column drop zone (empty column or end of list) ---
	function onColumnDropZoneDragOver(e: DragEvent, columnId: TicketStatus) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		dragOverColumnId = columnId;
	}

	function onColumnDropZoneDrop(e: DragEvent, targetColumn: TicketStatus) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const type = e.dataTransfer.getData('type');

		if (type === 'card') {
			localTickets = [...previewTickets];
		} else if (type === 'column') {
			const srcColumnId = e.dataTransfer.getData('columnId') as TicketStatus;
			if (srcColumnId === targetColumn) return;

			const srcIdx = columnOrder.indexOf(srcColumnId);
			const tgtIdx = columnOrder.indexOf(targetColumn);
			const newOrder = [...columnOrder];
			newOrder.splice(srcIdx, 1);
			newOrder.splice(tgtIdx, 0, srcColumnId);
			columnOrder = newOrder;
		}

		draggingCardId = null;
		draggingColumnId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	// --- Column DnD ---
	function onColumnHandleDragStart(e: DragEvent, columnId: TicketStatus) {
		draggingColumnId = columnId;
		draggingCardId = null;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('type', 'column');
			e.dataTransfer.setData('columnId', columnId);
		}
	}

	function onColumnHandleDragEnd() {
		draggingColumnId = null;
		draggingCardId = null;
		dragOverColumnId = null;
		dragOverCardId = null;
	}

	function onColumnDragOver(e: DragEvent, columnId: TicketStatus) {
		if (draggingColumnId !== null) {
			e.preventDefault();
			if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
			dragOverColumnId = columnId;
		}
	}
</script>

<div class="flex gap-4 overflow-x-auto pb-4">
	{#each columnOrder as columnId, index (columnId)}
		{@const col = statusMap[columnId]}
		{@const colTickets = ticketsForColumn(columnId)}
		{@const isColDragging = draggingColumnId === columnId}

		<div
			role="region"
			aria-label={`${col.label} column`}
			class="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/40 transition-opacity
				{isColDragging ? 'opacity-40' : ''}
				"
			ondragover={(e) => {
				onColumnDragOver(e, columnId);
				onColumnDropZoneDragOver(e, columnId);
			}}
			ondrop={(e) => onColumnDropZoneDrop(e, columnId)}
		>
			<!-- Column Header -->
			<div class="flex items-center gap-2 px-3 py-3">
				<div
					role="button"
					aria-label="Drag to reorder column"
					tabindex={index}
					draggable="true"
					class="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
					ondragstart={(e) => onColumnHandleDragStart(e, columnId)}
					ondragend={onColumnHandleDragEnd}
				>
					<GripVertical class="h-4 w-4" />
				</div>

				<col.icon class="h-4 w-4 text-muted-foreground" />
				<span class="flex-1 text-sm font-semibold">{col.label}</span>
				<Badge variant="secondary" class="ml-auto rounded-full px-2 py-0 text-xs">
					{colTickets.length}
				</Badge>
			</div>

			<!-- Cards list -->
			<div class="flex flex-1 flex-col gap-2 px-2 pb-2">
				{#each colTickets as ticket (ticket.id)}
					{@const isDragging = draggingCardId === ticket.id}
					{@const priority = priorityMap[ticket.priority]}

					<div
						role="region"
						aria-label={`Ticket ${ticket.id}`}
						draggable="true"
						class="transition-opacity {isDragging ? 'opacity-30' : ''}"
						ondragstart={(e) => onCardDragStart(e, ticket.id, columnId)}
						ondragend={onCardDragEnd}
						ondragover={(e) => onCardDragOver(e, ticket.id, columnId)}
						ondrop={(e) => onCardDrop(e, ticket.id, columnId)}
					>
						<Card class="cursor-grab bg-background shadow-sm select-none active:cursor-grabbing">
							<CardHeader class="p-3 pb-1">
								<p class="line-clamp-1 text-sm leading-snug font-medium">{ticket.title}</p>
							</CardHeader>
							<CardContent class="p-3 pt-1">
								<p class="mb-3 line-clamp-2 text-xs text-muted-foreground">{ticket.description}</p>
								<div class="flex items-center justify-between gap-2">
									<span class="truncate text-xs text-muted-foreground">{ticket.property.label}</span>
									<Badge
										variant={priority.variant}
										class="flex shrink-0 items-center gap-1 text-xs"
									>
										<priority.icon class="h-3 w-3" />
										{priority.label}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				{/each}

				<!-- Empty state -->
				{#if colTickets.length === 0}
					<div
						class="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-6 text-center"
					>
						<p class="text-xs text-muted-foreground">No tasks here.</p>
					</div>
				{/if}

				<!-- Add Task button -->
				<Button
					variant="ghost"
					class="mt-1 w-full justify-start text-muted-foreground hover:text-foreground"
				>
					<Plus class="mr-2 h-4 w-4" />
					Add Task
				</Button>
			</div>
		</div>
	{/each}
</div>
