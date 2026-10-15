import type { Id, IdAndLabel, Timestamp } from '@/shared/types';

export const ticketPriorityValues = ['low', 'medium', 'high'] as const;
export const ticketPriorityOptions = {
	low: 'Low',
	medium: 'Medium',
	high: 'High',
};
export type TicketPriority = (typeof ticketPriorityValues)[number];

export const ticketStatusValues = ['open', 'in_progress', 'resolved', 'cancelled'] as const;
export const ticketStatusOptions = {
	open: 'Open',
	in_progress: 'In Progress',
	resolved: 'Resolved',
	cancelled: 'Cancelled',
};
export type TicketStatus = (typeof ticketStatusValues)[number];

/** Mirrors public.ticket_status_transitions */
export const ticketStatusTransitions: Record<TicketStatus, readonly TicketStatus[]> = {
	open: ['in_progress', 'cancelled'],
	in_progress: ['open', 'resolved', 'cancelled'],
	resolved: ['open', 'cancelled'],
	cancelled: ['open'],
};

export function canTransitionTicketStatus(from: TicketStatus, to: TicketStatus): boolean {
	return from === to || ticketStatusTransitions[from].includes(to);
}

export type Ticket = {
	id: Id;
	created_at: Timestamp;
	priority: TicketPriority;
	status: TicketStatus;
	title: string;
	description: string;
	property: IdAndLabel;
	rank: string;
};

export type TicketOption = {
	id: Id;
	title: string;
};
