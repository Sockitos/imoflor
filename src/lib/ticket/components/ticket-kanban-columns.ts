import type { KanbanColumnDef } from '@/shared/components/kanban-board/types';
import { ticketStatusValues } from '../types';
import { statusMap } from './ticket-status-map';

export const ticketKanbanColumns: KanbanColumnDef[] = ticketStatusValues.map((status) => ({
	id: status,
	label: statusMap[status].label,
}));
