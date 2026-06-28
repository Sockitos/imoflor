<script lang="ts">
	import InterventionForm from '@/intervention/components/intervention-form.svelte';
	import InterventionKanbanCard from '@/intervention/components/intervention-kanban-card.svelte';
	import PageSubtitle from '@/shared/components/page-subtitle.svelte';
	import PageTitle from '@/shared/components/page-title.svelte';
	import { Button } from '@/shared/components/ui/button';
	import { Separator } from '@/shared/components/ui/separator';
	import { CirclePlus } from 'lucide-svelte';
	import KanbanBoard from '@/shared/components/kanban-board';
	import { interventionKanbanColumns } from '@/intervention/components/intervention-kanban-columns';
	import type { InterventionStatus } from '@/intervention/types';
	import { getInterventions, updateStatus } from '@/intervention/intervention.remote.js';
	import { Spinner } from '@/shared/components/ui/spinner';
	import { generateRankBetween } from '@/shared/utils';
	import { toast } from 'svelte-sonner';

	let openForm = $state(false);
	let defaultStatus = $state<InterventionStatus | undefined>(undefined);

	let interventions = $derived(getInterventions());

	let cards = $derived(interventions.current?.map((i) => ({ ...i, columnId: i.status })) ?? []);

	function openInterventionForm(status?: InterventionStatus) {
		defaultStatus = status;
		openForm = true;
	}

	function onAddIntervention() {
		openInterventionForm();
	}

	function onAddCard(status: string) {
		openInterventionForm(status as InterventionStatus);
	}

	async function onMoveCard(
		id: number,
		columnId: string,
		upperRank: string | undefined,
		bottomRank: string | undefined
	) {
		const status = columnId as InterventionStatus;
		const rank = generateRankBetween(upperRank, bottomRank);

		try {
			await updateStatus({ id, status, rank }).updates(
				getInterventions().withOverride((interventions) =>
					interventions.map((intervention) =>
						intervention.id === id ? { ...intervention, status, rank } : intervention
					)
				)
			);
		} catch {
			toast.error('Failed to move intervention. Please try again.');
		}
	}
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>
				Interventions
				{#if interventions.ready}
					({interventions.current?.length})
				{/if}
			</PageTitle>
			<PageSubtitle>Manage your interventions and Lorem Ipsum</PageSubtitle>
		</div>
		<Button onclick={onAddIntervention}>
			<CirclePlus class="mr-2 h-4 w-4" />
			Add Intervention
		</Button>
	</div>
	<Separator />
	{#if interventions.error}
		<div class="flex flex-col items-center gap-y-4">
			<p class="text-sm text-destructive">Failed to load interventions.</p>
			<Button variant="outline" class="w-fit" onclick={() => interventions.refresh()}>Retry</Button>
		</div>
	{:else if !interventions.ready}
		<div class="flex items-center justify-center">
			<Spinner class="size-6" />
		</div>
	{:else}
		<KanbanBoard columns={interventionKanbanColumns} {cards} {onAddCard} {onMoveCard}>
			{#snippet card(intervention)}
				<InterventionKanbanCard {intervention} />
			{/snippet}
		</KanbanBoard>
	{/if}
</div>

<InterventionForm bind:open={openForm} {defaultStatus} />
