import { ticketStatusValues } from '../types';
import { statusMap } from './ticket-status-map';

export type KanbanColumn = {
	id: string;
	label: string;
};

export const ticketKanbanColumns: KanbanColumn[] = ticketStatusValues.map((status) => ({
	id: status,
	label: statusMap[status].label,
}));
