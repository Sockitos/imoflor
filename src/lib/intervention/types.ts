import type { Id, IdAndLabel, Timestamp } from '@/shared/types';

export const interventionStatusValues = [
	'not_started',
	'in_progress',
	'completed',
	'cancelled',
] as const;
export const interventionStatusOptions = {
	not_started: 'Not Started',
	in_progress: 'In Progress',
	completed: 'Completed',
	cancelled: 'Cancelled',
};
export type InterventionStatus = (typeof interventionStatusValues)[number];

/** Mirrors public.intervention_status_transitions */
export const interventionStatusTransitions: Record<
	InterventionStatus,
	readonly InterventionStatus[]
> = {
	not_started: ['in_progress', 'cancelled'],
	in_progress: ['not_started', 'completed', 'cancelled'],
	completed: [],
	cancelled: ['not_started'],
};

export function canTransitionInterventionStatus(
	from: InterventionStatus,
	to: InterventionStatus
): boolean {
	return from === to || interventionStatusTransitions[from].includes(to);
}

export const interventionTypeValues = ['new', 'renovation', 'maintenance'] as const;
export const interventionTypeOptions = {
	new: 'New',
	renovation: 'Renovation',
	maintenance: 'Maintenance',
};
export type InterventionType = (typeof interventionTypeValues)[number];

export type Intervention = {
	id: Id;
	type: InterventionType;
	status: InterventionStatus;
	start_date?: Timestamp | null;
	end_date?: Timestamp | null;
	description: string;
	property: IdAndLabel;
	ticket?: IdAndLabel | null;
	rank: string;
};

export type InterventionExpense = {
	id: Id;
	intervention_id: Id;
	movement_id: Id;
};
