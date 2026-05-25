export type KanbanColumnDef = {
	id: string;
	label: string;
};

export type ColumnCards<TCard> = Record<string, TCard[]>;
