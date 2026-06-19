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

export type Ticket = {
	id: Id;
	date: Timestamp;
	priority: TicketPriority;
	status: TicketStatus;
	title: string;
	description: string;
	property: IdAndLabel;
	rank: string;
};
