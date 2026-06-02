export type KanbanColumnDef = {
	id: string;
	label: string;
};

export type KanbanCardDef = { id: number; columnId: string; rank: string };

export type ColumnCards<TCard> = Record<string, TCard[]>;
