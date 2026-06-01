import type { KanbanColumnDef } from '@/shared/components/kanban-board/types';
import { interventionStatusValues } from '../types';
import { statusMap } from './intervention-status-map';

export const interventionKanbanColumns: KanbanColumnDef[] = interventionStatusValues.map(
	(status) => ({
		id: status,
		label: statusMap[status].label,
	})
);
